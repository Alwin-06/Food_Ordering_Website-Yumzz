const express = require('express');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
const { body } = require('express-validator');

const router = express.Router();

const createOrderValidation = [
    body('clientOrderItems').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('clientOrderItems.*.menuItem').notEmpty().withMessage('Menu item ID is required for each item'),
    body('clientOrderItems.*.qty').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),

    body('deliveryAddress.address').notEmpty().withMessage('Delivery address is required'),
    body('deliveryAddress.city').notEmpty().withMessage('City is required'),
    body('deliveryAddress.postalCode').notEmpty().withMessage('Postal code is required'),
    body('deliveryAddress.country').notEmpty().withMessage('Country is required'),

    body('restaurantId').notEmpty().withMessage('Restaurant ID is required for the order'),

    body('paymentMethod').isIn(['COD', 'Card', 'UPI']).withMessage('Invalid payment method. Must be COD, Card, or UPI.'),

    body('couponCode').optional().isString().trim().notEmpty().withMessage('Coupon code cannot be empty if provided'),

];

const updateOrderStatusValidation = [
    body('orderStatus')
        .notEmpty().withMessage('Order status is required')
        .isIn(['pending_payment', 'pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled', 'refunded'])
        .withMessage('Invalid order status. Must be one of: pending_payment, pending, confirmed, preparing, out for delivery, delivered, cancelled, refunded.'),
];


router.route('/')
    .post(protect, createOrderValidation, createOrder)
    .get(protect, authorizeRoles('admin', 'restaurant'), getOrders);

router.get('/myorders', protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/status')
    .put(
        protect,
        authorizeRoles('admin', 'restaurant'),
        updateOrderStatusValidation,
        updateOrderStatus
    );

module.exports = router;












// const express = require('express');
// const {
//     createOrder,
//     getMyOrders,
//     getOrderById,
//     getOrders,
//     updateOrderStatus,
// } = require('../controllers/orderController');
// const { protect } = require('../middleware/authMiddleware');
// const authorizeRoles = require('../middleware/authorizeRoles');
// const { body } = require('express-validator');

// const router = express.Router();

// const orderValidation = [
//     body('orderItems').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
//     body('orderItems.*.menuItem').notEmpty().withMessage('Menu item ID is required for each item'),
//     body('orderItems.*.qty').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
//     body('deliveryAddress.address').notEmpty().withMessage('Delivery address is required'),
//     body('deliveryAddress.city').notEmpty().withMessage('City is required'),
//     body('deliveryAddress.postalCode').notEmpty().withMessage('Postal code is required'),
//     body('deliveryAddress.country').notEmpty().withMessage('Country is required'),
//     body('restaurantId').notEmpty().withMessage('Restaurant ID is required for the order'),
//     body('totalPrice').isFloat({ gt: 0 }).withMessage('Total price must be a positive number'),
// ];

// router.route('/')
//     .post(protect, orderValidation, createOrder)
//     .get(protect, authorizeRoles('admin', 'restaurant'), getOrders);

// router.get('/myorders', protect, getMyOrders);

// router.route('/:id')
//     .get(protect, getOrderById);

// router.route('/:id/status')
//     .put(
//         protect,
//         authorizeRoles('admin', 'restaurant'),
//         body('orderStatus').notEmpty().withMessage('Order status is required'),
//         updateOrderStatus
//     );


// module.exports = router;