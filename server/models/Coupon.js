const mongoose = require('mongoose');

const couponSchema = mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'Coupon code is required'],
            unique: true,
            trim: true,
            uppercase: true,
        },
        type: {
            type: String,
            enum: ['percentage', 'fixedAmount'],
            required: [true, 'Coupon type is required'],
        },
        discount: {
            type: Number,
            required: [true, 'Discount value is required'],
            min: 0,
        },
        minOrderValue: {
            type: Number,
            default: 0,
            min: 0,
        },
        expiryDate: {
            type: Date,
            required: [true, 'Expiry date is required'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        usageLimit: {
            type: Number,
            min: 0,
            default: Infinity
        },
        usedCount: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Coupon', couponSchema);