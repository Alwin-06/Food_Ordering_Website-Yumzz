const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                menuItem: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'MenuItem',
                },
            },
        ],
        orderId: {
            type: String,
            unique: true,
            required: true,
        },
        deliveryAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        discountApplied: {
            type: Number,
            required: true,
            default: 0.0,
        },
        finalAmount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
            unique: true,
            sparse: true,
        },
        orderStatus: {
            type: String,
            enum: ['pending_payment', 'pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled', 'refunded'],
            default: 'pending_payment',
            required: true,
        },
        coupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon',
            default: null,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;






// const mongoose = require('mongoose');

// const orderSchema = mongoose.Schema(
//     {
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true,
//         },
//         restaurant: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Restaurant',
//             required: true,
//         },
//         orderItems: [
//             {
//                 name: { type: String, required: true },
//                 qty: { type: Number, required: true },
//                 image: { type: String, required: true },
//                 price: { type: Number, required: true },
//                 menuItem: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     required: true,
//                     ref: 'MenuItem',
//                 },
//             },
//         ],
//         deliveryAddress: {
//             address: { type: String, required: true },
//             city: { type: String, required: true },
//             postalCode: { type: String, required: true },
//             country: { type: String, required: true },
//         },
//         totalPrice: {
//             type: Number,
//             required: true,
//             default: 0.0,
//         },
//         orderStatus: {
//             type: String,
//             required: true,
//             default: 'Pending',
//         },
//         paymentMethod: {
//             type: String,
//             enum: ['COD', 'Card', 'UPI'],
//             required: false,
//         },
//         couponId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Coupon',
//             default: null,
//             required: false,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// const Order = mongoose.model('Order', orderSchema);

// module.exports = Order;
