const express = require('express');
const {
    initiatePayment,
    getPaymentDetails,
    handlePaymentWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

const router = express.Router();

const initiatePaymentValidation = [
    body('orderId').isMongoId().withMessage('Valid Order ID is required.'),
    body('paymentId').isMongoId().withMessage('Valid Payment ID is required.'),
];

router.post('/initiate', protect, initiatePaymentValidation, initiatePayment);

router.get('/:id', protect, getPaymentDetails);

router.post('/webhook', express.raw({ type: 'application/json' }), handlePaymentWebhook);

module.exports = router;