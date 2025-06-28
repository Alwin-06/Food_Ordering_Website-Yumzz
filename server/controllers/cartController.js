const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

/**
 * @desc    Get the logged-in user's cart
 * @route   GET /api/cart
 * @access  Private (User)
 */
const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.menuItem', 'name description price image');
    if (!cart) {
        cart = await Cart.create({ userId: req.user._id, restaurantId: null, items: [] });
    }
    res.json(cart);
});

/**
 * @desc    Add item to cart or update quantity if item exists
 * @route   POST /api/cart/add
 * @access  Private (User)
 */
const addItemToCart = asyncHandler(async (req, res) => {
    const { menuItemId, quantity, restaurantId } = req.body;

    if (!menuItemId || !quantity || !restaurantId) {
        res.status(400);
        throw new Error('Please provide menuItemId, quantity, and restaurantId');
    }

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem || !menuItem.isAvailable) {
        res.status(404);
        throw new Error('Menu item not found or not available');
    }

    if (menuItem.restaurant.toString() !== restaurantId.toString()) {
        res.status(400);
        throw new Error('Menu item does not belong to the specified restaurant');
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            userId: req.user._id,
            restaurantId,
            items: [{
                menuItem: menuItemId,
                quantity,
                price: menuItem.price
            }]
        });
        return res.status(201).json(cart);
    }

    if (cart.restaurantId && cart.restaurantId.toString() !== restaurantId.toString()) {
        cart.items = [];
        cart.restaurantId = restaurantId;
        console.log(`Cart cleared and switched to new restaurant: ${restaurantId}`);
    } else if (!cart.restaurantId) {
        cart.restaurantId = restaurantId;
    }

    const itemIndex = cart.items.findIndex(item => item.menuItem.toString() === menuItemId.toString());

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = menuItem.price;
    } else {
        cart.items.push({
            menuItem: menuItemId,
            quantity,
            price: menuItem.price
        });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.menuItem', 'name description price image');
    res.json(populatedCart);
});


/**
 * @desc    Update quantity of an item in the cart
 * @route   PUT /api/cart/update-item
 * @access  Private (User)
 */
const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { menuItemId, quantity } = req.body;

    if (!menuItemId || quantity === undefined) {
        res.status(400);
        throw new Error('Please provide menuItemId and quantity');
    }
    if (quantity < 0) {
        res.status(400);
        throw new Error('Quantity cannot be negative. Use remove-item to delete.');
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found for this user');
    }

    const itemIndex = cart.items.findIndex(item => item.menuItem.toString() === menuItemId.toString());

    if (itemIndex > -1) {
        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.menuItem', 'name description price image');
        res.json(populatedCart);
    } else {
        res.status(404);
        throw new Error('Menu item not found in cart');
    }
});

/**
 * @desc    Remove an item from the cart
 * @route   DELETE /api/cart/remove-item
 * @access  Private (User)
 */
const removeItemFromCart = asyncHandler(async (req, res) => {
    const { menuItemId } = req.body;

    if (!menuItemId) {
        res.status(400);
        throw new Error('Please provide menuItemId');
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found for this user');
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.menuItem.toString() !== menuItemId.toString());

    if (cart.items.length === initialLength) {
        res.status(404);
        throw new Error('Menu item not found in cart');
    }

    if (cart.items.length === 0) {
        cart.restaurantId = null;
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.menuItem', 'name description price image');
    res.json(populatedCart);
});

/**
 * @desc    Clear the entire cart
 * @route   DELETE /api/cart/clear
 * @access  Private (User)
 */
const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found for this user');
    }

    cart.items = [];
    cart.restaurantId = null;
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.menuItem', 'name description price image');
    res.json(populatedCart);
});


module.exports = {
    getCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    clearCart,
};