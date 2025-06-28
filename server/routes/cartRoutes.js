const express = require('express');
const {
    getCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

const router = express.Router();

router.get('/', protect, getCart);

router.post(
    '/add',
    protect,
    [
        body('menuItemId').notEmpty().withMessage('Menu item ID is required'),
        body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
        body('restaurantId').notEmpty().withMessage('Restaurant ID is required'),
    ],
    addItemToCart
);

router.put(
    '/update-item',
    protect,
    [
        body('menuItemId').notEmpty().withMessage('Menu item ID is required'),
        body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    ],
    updateCartItemQuantity
);

router.delete(
    '/remove-item',
    protect,
    [body('menuItemId').notEmpty().withMessage('Menu item ID is required')],
    removeItemFromCart
);

router.delete('/clear', protect, clearCart);

module.exports = router;
