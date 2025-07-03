const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        paymentGateway: {
            type: String,
            enum: ['COD', 'Card', 'UPI'],
            required: true,
        },
        transactionId: {
            type: String,
            required: function() { return this.paymentGateway !== 'COD'; },
            unique: true,
            sparse: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            required: true,
            default: 'INR',
        },
        status: {
            type: String,
            enum: ['pending', 'succeeded', 'failed', 'refunded', 'disputed'],
            default: 'pending',
            required: true,
        },
        gatewayResponse: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Payment', paymentSchema);