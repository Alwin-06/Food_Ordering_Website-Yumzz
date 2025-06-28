const express = require('express');
const {
    createCoupon,
    getCoupons,
    getCouponByCode,
    updateCoupon,
    deleteCoupon,
} = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');
const { body, param } = require('express-validator');

const router = express.Router();

const couponValidation = [
    body('code').notEmpty().withMessage('Coupon code is required').trim().toUpperCase(),
    body('type').isIn(['percentage', 'fixedAmount']).withMessage('Coupon type must be "percentage" or "fixedAmount"'),
    body('discount').isFloat({ min: 0 }).withMessage('Discount must be a non-negative number'),
    body('minOrderValue').optional().isFloat({ min: 0 }).withMessage('Minimum order value must be a non-negative number'),
    body('expiryDate').isISO8601().toDate().withMessage('Expiry date must be a valid date'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    body('usageLimit').optional().isInt({ min: 0 }).withMessage('Usage limit must be a non-negative integer'),
];

router
    .route('/')
    .post(protect, authorizeRoles('admin'), couponValidation, createCoupon)
    .get(protect, authorizeRoles('admin'), getCoupons);

router.get('/:code', getCouponByCode);

router
    .route('/:id')
    .put(protect, authorizeRoles('admin'), couponValidation, updateCoupon)
    .delete(protect, authorizeRoles('admin'), deleteCoupon);


module.exports = router;