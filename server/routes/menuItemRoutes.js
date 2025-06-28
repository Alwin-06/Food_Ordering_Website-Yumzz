const express = require('express');
const {
    createMenuItem,
    getMenuItemsByRestaurant,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
} = require('../controllers/menuItemController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
const { body } = require('express-validator');

const router = express.Router();

const menuItemValidation = [
    body('name').notEmpty().withMessage('Menu item name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
    body('restaurantId').notEmpty().withMessage('Restaurant ID is required'),
    body('isAvailable').optional().isBoolean().withMessage('isAvailable must be a boolean'),
];

router.get('/restaurant/:restaurantId', getMenuItemsByRestaurant);
router.get('/:id', getMenuItemById);

router
    .route('/')
    .post(
        protect,
        authorizeRoles('admin', 'restaurant'),
        menuItemValidation,
        createMenuItem
    );

router
    .route('/:id')
    .put(
        protect,
        authorizeRoles('admin', 'restaurant'),
        menuItemValidation,
        updateMenuItem
    )
    .delete(
        protect,
        authorizeRoles('admin', 'restaurant'),
        deleteMenuItem
    );

module.exports = router;