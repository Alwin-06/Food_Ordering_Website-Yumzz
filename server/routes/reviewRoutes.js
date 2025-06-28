const express = require('express');
const {
    createReview,
    getReviewsByRestaurant,
    getReviewById,
    updateReview,
    deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
const { body } = require('express-validator');

const router = express.Router();

const reviewValidation = [
    body('restaurantId').notEmpty().withMessage('Restaurant ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required'),
];

router.get('/restaurant/:restaurantId', getReviewsByRestaurant);
router.get('/:id', getReviewById);

router
    .route('/')
    .post(
        protect,
        authorizeRoles('user'),
        reviewValidation,
        createReview
    );

router
    .route('/:id')
    .put(
        protect,
        authorizeRoles('user', 'admin'),
        reviewValidation,
        updateReview
    )
    .delete(
        protect,
        authorizeRoles('user', 'admin'),
        deleteReview
    );

module.exports = router;