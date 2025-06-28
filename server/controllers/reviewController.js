const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private (User)
 */
const createReview = asyncHandler(async (req, res) => {
    const { restaurantId, rating, comment } = req.body;

    if (!restaurantId || !rating || !comment) {
        res.status(400);
        throw new Error('Please provide restaurantId, rating, and comment');
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    // const alreadyReviewed = await Review.findOne({
    //     user: req.user._id,
    //     restaurant: restaurantId,
    // });
    // if (alreadyReviewed) {
    //     res.status(400);
    //     throw new Error('You have already reviewed this restaurant');
    // }

    const review = await Review.create({
        user: req.user._id,
        restaurant: restaurantId,
        rating,
        comment,
    });

    if (review) {
        const reviews = await Review.find({ restaurant: restaurantId });
        const numReviews = reviews.length;
        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        restaurant.averageRating = numReviews > 0 ? totalRating / numReviews : 0;
        restaurant.numReviews = numReviews;
        await restaurant.save();

        res.status(201).json(review);
    } else {
        res.status(400);
        throw new Error('Invalid review data');
    }
});

/**
 * @desc    Get all reviews for a specific restaurant
 * @route   GET /api/reviews/restaurant/:restaurantId
 * @access  Public
 */
const getReviewsByRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.params.restaurantId;

    const reviews = await Review.find({ restaurant: restaurantId }).populate('user', 'name');
    res.json(reviews);
});

/**
 * @desc    Get a single review by ID
 * @route   GET /api/reviews/:id
 * @access  Public
 */
const getReviewById = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id).populate('user', 'name').populate('restaurant', 'name');

    if (review) {
        res.json(review);
    } else {
        res.status(404);
        throw new Error('Review not found');
    }
});

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private (Owner of review or Admin)
 */
const updateReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (review) {
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to update this review');
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        const updatedReview = await review.save();

        const restaurant = await Restaurant.findById(review.restaurant);
        if (restaurant) {
            const reviews = await Review.find({ restaurant: restaurant._id });
            const numReviews = reviews.length;
            const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
            restaurant.averageRating = numReviews > 0 ? totalRating / numReviews : 0;
            restaurant.numReviews = numReviews;
            await restaurant.save();
        }

        res.json(updatedReview);
    } else {
        res.status(404);
        throw new Error('Review not found');
    }
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Owner of review or Admin)
 */
const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (review) {
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to delete this review');
        }

        await review.deleteOne();

        const restaurant = await Restaurant.findById(review.restaurant);
        if (restaurant) {
            const reviews = await Review.find({ restaurant: restaurant._id });
            const numReviews = reviews.length;
            const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
            restaurant.averageRating = numReviews > 0 ? totalRating / numReviews : 0;
            restaurant.numReviews = numReviews;
            await restaurant.save();
        }

        res.json({ message: 'Review removed' });
    } else {
        res.status(404);
        throw new Error('Review not found');
    }
});

module.exports = {
    createReview,
    getReviewsByRestaurant,
    getReviewById,
    updateReview,
    deleteReview,
};