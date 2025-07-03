const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Restaurant = require('../models/Restaurant');

/**
 * @desc    Initiate an online payment for a pending order
 * @route   POST /api/payments/initiate
 * @access  Private (User)
 */
const initiatePayment = asyncHandler(async (req, res) => {
    const { orderId, paymentId } = req.body;

    if (!orderId || !paymentId) {
        res.status(400);
        throw new Error('Order ID and Payment ID are required.');
    }

    const order = await Order.findById(orderId);
    const payment = await Payment.findById(paymentId);

    if (!order || !payment) {
        res.status(404);
        throw new Error('Order or Payment record not found.');
    }

    if (order.user.toString() !== req.user._id.toString() || payment.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to process this payment for another user.');
    }

    if (order.orderStatus !== 'pending_payment' || payment.status !== 'pending') {
        res.status(400);
        throw new Error('Payment has already been processed or order is not in a pending payment state.');
    }

    if (payment.paymentGateway === 'COD') {
        res.status(400);
        throw new Error('COD orders do not require payment initiation via this route.');
    }

    const isPaymentSuccessful = Math.random() > 0.1;

    if (isPaymentSuccessful) {
        payment.status = 'succeeded';
        payment.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        payment.gatewayResponse = { message: 'Simulated payment success.' };
        order.orderStatus = 'confirmed';
    } else {
        payment.status = 'failed';
        payment.gatewayResponse = { message: 'Simulated payment failure.', errorCode: 'SIM_ERR_001' };
        order.orderStatus = 'cancelled';
    }

    await payment.save();
    await order.save();

    if (payment.status === 'succeeded') {
        res.status(200).json({
            message: 'Payment processed successfully, and order confirmed!',
            orderId: order._id,
            paymentId: payment._id,
            paymentStatus: payment.status,
            orderStatus: order.orderStatus,
            transactionId: payment.transactionId,
        });
    } else {
        res.status(400).json({
            message: 'Payment initiation failed.',
            orderId: order._id,
            paymentId: payment._id,
            paymentStatus: payment.status,
            orderStatus: order.orderStatus,
            errorDetails: payment.gatewayResponse,
        });
    }
});

/**
 * @desc    Get details of a specific payment record
 * @route   GET /api/payments/:id
 * @access  Private (User who made the payment, Admin, or Restaurant Owner of the associated order)
 */
const getPaymentDetails = asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id)
        .populate({
            path: 'order',
            populate: { path: 'restaurant', select: 'owner name' }
        })
        .populate('user', 'name email phoneNo');

    if (!payment) {
        res.status(404);
        throw new Error('Payment record not found.');
    }

    let isAuthorized = false;

    if (payment.user._id.toString() === req.user._id.toString()) {
        isAuthorized = true;
    }
    else if (req.user.role === 'admin') {
        isAuthorized = true;
    }
    else if (req.user.role === 'restaurant' && payment.order && payment.order.restaurant) {
        if (payment.order.restaurant.owner.toString() === req.user._id.toString()) {
            isAuthorized = true;
        }
    }

    if (isAuthorized) {
        res.json(payment);
    } else {
        res.status(403);
        throw new Error('Not authorized to view this payment details.');
    }
});

/**
 * @desc    Handle payment gateway webhooks (server-to-server notifications)
 * @route   POST /api/payments/webhook
 * @access  Public (called by payment gateway)
 */
const handlePaymentWebhook = asyncHandler(async (req, res) => {

    console.log('Received Payment Webhook. Body:', req.body);

    const eventType = req.body.event_type || 'unknown';
    const eventData = req.body.data || {};

    try {
        switch (eventType) {
            case 'payment_succeeded':
                const transactionId = eventData.id;
                const payment = await Payment.findOne({ transactionId: transactionId });

                if (payment) {
                    payment.status = 'succeeded';
                    payment.gatewayResponse = req.body;
                    await payment.save();

                    const order = await Order.findById(payment.order);
                    if (order && order.orderStatus === 'pending_payment') {
                        order.orderStatus = 'confirmed';
                        await order.save();
                    }
                    console.log(`Payment ${transactionId} succeeded and order ${order ? order._id : 'N/A'} confirmed.`);
                } else {
                    console.warn(`Webhook: Payment with transactionId ${transactionId} not found.`);
                }
                break;

            case 'payment_failed':
            case 'charge.failed':
                console.log(`Payment ${eventData.id} failed.`);
                break;
            case 'charge.refunded':
                console.log(`Payment ${eventData.id} refunded.`);
                break;
            default:
                console.log(`Unhandled webhook event type: ${eventType}`);
        }
        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed.' });
    }
});


module.exports = {
    initiatePayment,
    getPaymentDetails,
    handlePaymentWebhook,
};