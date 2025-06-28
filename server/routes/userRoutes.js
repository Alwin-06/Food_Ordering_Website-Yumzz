const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

const router = express.Router();

const userProfileUpdateValidation = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please enter a valid email address'),
    body('phoneNo').optional().matches(/^\d{10}$/).withMessage('Please enter a valid 10-digit phone number').custom((value, { req }) => {
        if (value === null) {
            return true;
        }
        return true;
    }),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, userProfileUpdateValidation, updateUserProfile);

module.exports = router;