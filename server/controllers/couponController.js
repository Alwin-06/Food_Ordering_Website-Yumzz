const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

/**
 * @desc    Create a new coupon
 * @route   POST /api/coupons
 * @access  Private (Admin)
 */
const createCoupon = asyncHandler(async (req, res) => {
    const { code, type, discount, minOrderValue, expiryDate, isActive, usageLimit } = req.body;

    if (!code || !type || !discount || !expiryDate) {
        res.status(400);
        throw new Error('Please provide code, type, discount, and expiryDate');
    }

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
        res.status(400);
        throw new Error('Coupon with this code already exists');
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        type,
        discount,
        minOrderValue: minOrderValue || 0,
        expiryDate,
        isActive: isActive !== undefined ? isActive : true,
        usageLimit: usageLimit !== undefined ? usageLimit : Infinity,
    });

    res.status(201).json(coupon);
});

/**
 * @desc    Get all coupons
 * @route   GET /api/coupons
 * @access  Private (Admin)
 */
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    res.json(coupons);
});

/**
 * @desc    Get a single coupon by code (for validation/application by users)
 * @route   GET /api/coupons/:code
 * @access  Public (Can be accessed by users to check coupon validity)
 * NOTE: This route should ideally not expose sensitive info like usageLimit to regular users.
 * For now, we expose it for simplicity in backend testing.
 * In a real app, you'd have a separate route like /api/coupons/apply which takes code and order total.
 */
const getCouponByCode = asyncHandler(async (req, res) => {
    const code = req.params.code.toUpperCase();

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
        res.status(404);
        throw new Error('Coupon not found');
    }

    // Basic validation checks
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

    res.json(coupon);
});

/**
 * @desc    Update coupon details
 * @route   PUT /api/coupons/:id
 * @access  Private (Admin)
 */
const updateCoupon = asyncHandler(async (req, res) => {
    const { code, type, discount, minOrderValue, expiryDate, isActive, usageLimit, usedCount } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        if (code && code.toUpperCase() !== coupon.code && await Coupon.findOne({ code: code.toUpperCase() })) {
            res.status(400);
            throw new Error('New coupon code already exists');
        }

        coupon.code = code ? code.toUpperCase() : coupon.code;
        coupon.type = type || coupon.type;
        coupon.discount = discount !== undefined ? discount : coupon.discount;
        coupon.minOrderValue = minOrderValue !== undefined ? minOrderValue : coupon.minOrderValue;
        coupon.expiryDate = expiryDate || coupon.expiryDate;
        coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;
        coupon.usageLimit = usageLimit !== undefined ? usageLimit : coupon.usageLimit;
        coupon.usedCount = usedCount !== undefined ? usedCount : coupon.usedCount;

        const updatedCoupon = await coupon.save();
        res.json(updatedCoupon);
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

/**
 * @desc    Delete a coupon
 * @route   DELETE /api/coupons/:id
 * @access  Private (Admin)
 */
const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        await coupon.deleteOne();
        res.json({ message: 'Coupon removed' });
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

module.exports = {
    createCoupon,
    getCoupons,
    getCouponByCode,
    updateCoupon,
    deleteCoupon,
};