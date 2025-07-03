const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const Coupon = require('../models/Coupon');
const Payment = require('../models/Payment');
const { nanoid } = require('nanoid');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private (User)
 */
const createOrder = asyncHandler(async (req, res) => {
    const {
        orderItems: clientOrderItems,
        deliveryAddress,
        restaurantId,
        paymentMethod,
        couponCode,
    } = req.body;

    if (!clientOrderItems || clientOrderItems.length === 0) {
        res.status(400);
        throw new Error('No order items provided');
    }
    if (!deliveryAddress || !deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.postalCode || !deliveryAddress.country) {
        res.status(400);
        throw new Error('Please provide a complete delivery address');
    }
    if (!paymentMethod) {
        res.status(400);
        throw new Error('Payment method is required');
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    const menuItemIds = clientOrderItems.map(item => item.menuItem);
    const itemsFromDB = await MenuItem.find({ _id: { $in: menuItemIds } });

    let calculatedTotalAmount = 0;
    const validatedOrderItems = clientOrderItems.map(item => {
        const dbItem = itemsFromDB.find(dbI => dbI._id.toString() === item.menuItem.toString());

        if (!dbItem || !dbItem.isAvailable) {
            res.status(400);
            throw new Error(`Menu item '${item.name || item.menuItem}' not found or not available`);
        }
        const itemPrice = dbItem.price;
        calculatedTotalAmount += itemPrice * item.qty;

        return {
            name: dbItem.name,
            qty: item.qty,
            image: dbItem.image,
            price: itemPrice,
            menuItem: dbItem._id,
        };
    });

    let discountApplied = 0;
    let finalAmount = calculatedTotalAmount;
    let appliedCoupon = null;

    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

        if (!coupon) {
            res.status(404);
            throw new Error('Coupon not found');
        }
        if (!coupon.isActive) {
            res.status(400);
            throw new Error('Coupon is inactive');
        }
        if (coupon.expiryDate < new Date()) {
            res.status(400);
            throw new Error('Coupon has expired');
        }
        if (coupon.usedCount >= coupon.usageLimit) {
            res.status(400);
            throw new Error('Coupon usage limit reached');
        }
        if (calculatedTotalAmount < coupon.minOrderValue) {
            res.status(400);
            throw new Error(`Minimum order value of ${coupon.minOrderValue} not met for this coupon`);
        }

        if (coupon.type === 'percentage') {
            discountApplied = (calculatedTotalAmount * coupon.discount) / 100;
        } else if (coupon.type === 'fixedAmount') {
            discountApplied = coupon.discount;
        }

        finalAmount = Math.max(0, calculatedTotalAmount - discountApplied);
        appliedCoupon = coupon._id;
    }

    const generatedOrderId = `ORD-${nanoid(10).toUpperCase()}`;

    const order = new Order({
        user: req.user._id,
        restaurant: restaurantId,
        orderItems: validatedOrderItems,
        orderId: generatedOrderId,
        deliveryAddress,
        totalAmount: calculatedTotalAmount,
        discountApplied: discountApplied,
        finalAmount: finalAmount,
        coupon: appliedCoupon,
        orderStatus: 'pending_payment',
    });

    const createdOrder = await order.save();

    let paymentStatus;
    let paymentTransactionId = null;

    if (paymentMethod === 'COD') {
        paymentStatus = 'succeeded';
        createdOrder.orderStatus = 'confirmed';
        await createdOrder.save();
    } else {
        paymentStatus = 'pending';
    }

    const payment = new Payment({
        order: createdOrder._id,
        user: req.user._id,
        paymentGateway: paymentMethod,
        amount: finalAmount,
        currency: 'INR',
        status: paymentStatus,
    });

    const createdPayment = await payment.save();

    createdOrder.payment = createdPayment._id;
    await createdOrder.save();

    if (appliedCoupon) {
        await Coupon.findByIdAndUpdate(appliedCoupon, { $inc: { usedCount: 1 } });
    }

    if (paymentMethod === 'COD') {
        res.status(201).json({
            message: 'Order placed successfully (COD)',
            order: createdOrder,
            payment: createdPayment,
        });
    } else {
        res.status(201).json({
            message: 'Order created, proceed to payment',
            orderId: createdOrder._id,
            paymentId: createdPayment._id,
            finalAmount: createdOrder.finalAmount,
        });
    }
});

/**
 * @desc    Get all orders for the logged-in user
 * @route   GET /api/orders/myorders
 * @access  Private (User)
 */
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate('restaurant', 'name address')
        .populate('payment')
        .populate('coupon');
    res.json(orders);
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private (User, Restaurant owner of the order, or Admin)
 */
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email phoneNo')
        .populate('restaurant', 'name address')
        .populate('payment')
        .populate('coupon');

    if (order) {
        let isAuthorized = false;
        if (order.user.toString() === req.user._id.toString()) {
            isAuthorized = true;
        } else if (req.user.role === 'restaurant') {
            const restaurant = await Restaurant.findById(order.restaurant._id);
            if (restaurant && restaurant.owner.toString() === req.user._id.toString()) {
                isAuthorized = true;
            }
        } else if (req.user.role === 'admin') {
            isAuthorized = true;
        }

        if (isAuthorized) {
            res.json(order);
        } else {
            res.status(403);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

/**
 * @desc    Get all orders (for Admin or Restaurant Owner)
 * @route   GET /api/orders
 * @access  Private (Admin or Restaurant Owner)
 */
const getOrders = asyncHandler(async (req, res) => {
    let query = {};
    if (req.user.role === 'restaurant') {
        const restaurantsOwned = await Restaurant.find({ owner: req.user._id }).select('_id');
        const restaurantIds = restaurantsOwned.map(r => r._id);
        if (restaurantIds.length === 0) {
            return res.json([]);
        }
        query.restaurant = { $in: restaurantIds };
    }

    const orders = await Order.find(query)
        .populate('user', 'id name email')
        .populate('restaurant', 'name address')
        .populate('payment')
        .populate('coupon');
    res.json(orders);
});

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private (Admin or Restaurant owner)
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
        const restaurant = await Restaurant.findById(order.restaurant);
        if (!restaurant) {
            res.status(500);
            throw new Error('Associated restaurant not found for this order');
        }
        if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to update this order status');
            }

        const validStatuses = ['pending_payment', 'pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled', 'refunded'];
        if (!validStatuses.includes(orderStatus)) {
            res.status(400);
            throw new Error(`Invalid order status. Must be one of: ${validStatuses.join(', ')}`);
        }

        order.orderStatus = orderStatus;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderStatus,
};



















// const asyncHandler = require('express-async-handler');
// const Order = require('../models/Order');
// const MenuItem = require('../models/MenuItem');
// const Restaurant = require('../models/Restaurant');

// /**
//  * @desc    Create new order
//  * @route   POST /api/orders
//  * @access  Private (User)
//  */
// const createOrder = asyncHandler(async (req, res) => {
//     const {
//         orderItems,
//         deliveryAddress,
//         restaurantId,
//         totalPrice,
//     } = req.body;

//     if (!orderItems || orderItems.length === 0) {
//         res.status(400);
//         throw new Error('No order items');
//     }

//     const restaurant = await Restaurant.findById(restaurantId);
//     if (!restaurant) {
//         res.status(404);
//         throw new Error('Restaurant not found');
//     }
//     const itemsFromDB = await MenuItem.find({
//         _id: {
//             $in: orderItems.map(item => item.menuItem)
//         }
//     });

//     let calculatedTotalPrice = 0;
//     const validatedOrderItems = orderItems.map(item => {
//         const dbItem = itemsFromDB.find(dbI => dbI._id.toString() === item.menuItem.toString());

//         if (!dbItem || !dbItem.isAvailable) {
//             res.status(400);
//             throw new Error(`Menu item '${item.name}' not found or not available`);
//         }
//         const itemPrice = dbItem.price;
//         calculatedTotalPrice += itemPrice * item.qty;

//         return {
//             name: dbItem.name,
//             qty: item.qty,
//             image: dbItem.image,
//             price: itemPrice,
//             menuItem: dbItem._id,
//         };
//     });

//     if (Math.abs(calculatedTotalPrice - totalPrice) > 0.01) {
//         console.warn(`Client provided total (${totalPrice}) differs from calculated total (${calculatedTotalPrice})`);
//     }


//     const order = new Order({
//         user: req.user._id,
//         restaurant: restaurantId,
//         orderItems: validatedOrderItems,
//         deliveryAddress,
//         totalPrice: calculatedTotalPrice,
//         orderStatus: 'Pending',
//     });

//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
// });

// /**
//  * @desc    Get all orders for the logged-in user
//  * @route   GET /api/orders/myorders
//  * @access  Private (User)
//  */
// const getMyOrders = asyncHandler(async (req, res) => {
//     const orders = await Order.find({ user: req.user._id }).populate('restaurant', 'name address');
//     res.json(orders);
// });

// /**
//  * @desc    Get order by ID
//  * @route   GET /api/orders/:id
//  * @access  Private (User, Restaurant owner of the order, or Admin)
//  */
// const getOrderById = asyncHandler(async (req, res) => {
//     const order = await Order.findById(req.params.id)
//         .populate('user', 'name email phoneNo')
//         .populate('restaurant', 'name address');

//     if (order) {
//         if (order.user.toString() === req.user._id.toString() ||
//             order.restaurant.owner.toString() === req.user._id.toString() ||
//             req.user.role === 'admin') {
//             res.json(order);
//         } else {
//             res.status(403);
//             throw new Error('Not authorized to view this order');
//         }
//     } else {
//         res.status(404);
//         throw new Error('Order not found');
//     }
// });

// /**
//  * @desc    Get all orders (for Admin or Restaurant Owner)
//  * @route   GET /api/orders
//  * @access  Private (Admin or Restaurant Owner)
//  */
// const getOrders = asyncHandler(async (req, res) => {
//     let query = {};
//     if (req.user.role === 'restaurant') {
//         const restaurantsOwned = await Restaurant.find({ owner: req.user._id }).select('_id');
//         const restaurantIds = restaurantsOwned.map(r => r._id);
//         if (restaurantIds.length === 0) {
//             return res.json([]);
//         }
//         query.restaurant = { $in: restaurantIds };
//     }

//     const orders = await Order.find(query)
//         .populate('user', 'id name email')
//         .populate('restaurant', 'name address');
//     res.json(orders);
// });

// /**
//  * @desc    Update order status
//  * @route   PUT /api/orders/:id/status
//  * @access  Private (Admin or Restaurant owner)
//  */
// const updateOrderStatus = asyncHandler(async (req, res) => {
//     const { orderStatus } = req.body;

//     const order = await Order.findById(req.params.id);

//     if (order) {
//         const restaurant = await Restaurant.findById(order.restaurant);
//         if (!restaurant) {
//             res.status(500);
//             throw new Error('Associated restaurant not found for this order');
//         }
//         if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//             res.status(403);
//             throw new Error('Not authorized to update this order status');
//         }

//         const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
//         if (!validStatuses.includes(orderStatus)) {
//             res.status(400);
//             throw new Error(`Invalid order status. Must be one of: ${validStatuses.join(', ')}`);
//         }

//         order.orderStatus = orderStatus;

//         const updatedOrder = await order.save();
//         res.json(updatedOrder);
//     } else {
//         res.status(404);
//         throw new Error('Order not found');
//     }
// });

// module.exports = {
//     createOrder,
//     getMyOrders,
//     getOrderById,
//     getOrders,
//     updateOrderStatus,
// };