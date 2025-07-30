const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    addAddressToProfile,
    deleteAddress,
    setDefaultAddress,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
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

router.route('/profile/address').post(protect, addAddressToProfile);

router.get('/all', protect, authorizeRoles('admin'), getAllUsers);

router.route('/profile/address/:addressId').delete(protect, deleteAddress);
router.route('/profile/default-address').put(protect, setDefaultAddress);

module.exports = router;