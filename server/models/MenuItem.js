const mongoose = require('mongoose');

const menuItemSchema = mongoose.Schema(
    {
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Please add menu item name'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a description for the menu item'],
        },
        price: {
            type: Number,
            required: [true, 'Please add menu item price'],
            min: [0, 'Price cannot be negative'],
        },
        category: {
            type: String,
            required: [true, 'Please specify a category for the menu item'],
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Please add a menu item image URL'],
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
