const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a restaurant name'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a restaurant description'],
        },
        cuisineType: {
            type: String,
            required: [true, 'Please specify cuisine type'],
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Please add a restaurant image URL'],
        },
        address: {
            type: String,
            required: [true, 'Please add the restaurant address'],
            trim: true,
        },
        available: {
            type: Boolean,
            default: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);