const express = require('express');
const {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
} = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
const { body } = require('express-validator');

const router = express.Router();

const restaurantValidation = [
    body('name').notEmpty().withMessage('Restaurant name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('cuisineType').notEmpty().withMessage('Cuisine type is required'),
    body('image').isURL().withMessage('Valid image URL is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('available').optional().isBoolean().withMessage('Availability must be a boolean'),
];

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

router
    .route('/')
    .post(
        protect,
        authorizeRoles('admin', 'restaurant'),
        restaurantValidation,
        createRestaurant
    );

router
    .route('/:id')
    .put(
        protect,
        authorizeRoles('admin', 'restaurant'),
        restaurantValidation,
        updateRestaurant
    )
    .delete(
        protect,
        authorizeRoles('admin', 'restaurant'),
        deleteRestaurant
    );

module.exports = router;