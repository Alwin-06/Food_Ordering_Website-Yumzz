const asyncHandler = require('express-async-handler');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

/**
 * @desc    Create a new menu item for a specific restaurant
 * @route   POST /api/menuitems
 * @access  Private (Restaurant owner or Admin)
 */
const createMenuItem = asyncHandler(async (req, res) => {
    const { name, description, price, category, image, restaurantId, isAvailable } = req.body;

    if (!restaurantId) {
        res.status(400);
        throw new Error('Restaurant ID is required to create a menu item');
    }
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }

    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to add menu items to this restaurant');
    }

    const menuItem = await MenuItem.create({
        name,
        description,
        price,
        category,
        image,
        restaurant: restaurantId,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    if (menuItem) {
        res.status(201).json(menuItem);
    } else {
        res.status(400);
        throw new Error('Invalid menu item data');
    }
});

/**
 * @desc    Get all menu items for a specific restaurant
 * @route   GET /api/menuitems/restaurant/:restaurantId
 * @access  Public
 */
const getMenuItemsByRestaurant = asyncHandler(async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const { category, search } = req.query;

    let query = { restaurant: restaurantId };

    if (!req.user || (req.user && req.user.role === 'user')) {
        query.isAvailable = true;
    } else if (req.user && (req.user.role === 'restaurant' || req.user.role === 'admin')) {
        if (req.query.isAvailable === 'false') {
            query.isAvailable = false;
        } else if (req.query.isAvailable === 'true') {
            query.isAvailable = true;
        }
    }


    if (category) {
        query.category = category;
    }
    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const menuItems = await MenuItem.find(query);
    res.json(menuItems);
});

/**
 * @desc    Get a single menu item by ID
 * @route   GET /api/menuitems/:id
 * @access  Public
 */
const getMenuItemById = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
        if (!req.user || (req.user && req.user.role === 'user')) {
            if (menuItem.isAvailable) {
                res.json(menuItem);
            } else {
                res.status(404);
                throw new Error('Menu item not found or not available');
            }
        } else {
            res.json(menuItem);
        }
    } else {
        res.status(404);
        throw new Error('Menu item not found');
    }
});


/**
 * @desc    Update a menu item
 * @route   PUT /api/menuitems/:id
 * @access  Private (Restaurant owner or Admin)
 */
const updateMenuItem = asyncHandler(async (req, res) => {
    const { name, description, price, category, image, isAvailable } = req.body;

    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
        const restaurant = await Restaurant.findById(menuItem.restaurant);
        if (!restaurant) {
            res.status(500);
            throw new Error('Associated restaurant not found for this menu item');
        }

        if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to update this menu item');
        }

        menuItem.name = name || menuItem.name;
        menuItem.description = description || menuItem.description;
        menuItem.price = price || menuItem.price;
        menuItem.category = category || menuItem.category;
        menuItem.image = image || menuItem.image;
        menuItem.isAvailable = isAvailable !== undefined ? isAvailable : menuItem.isAvailable;

        const updatedMenuItem = await menuItem.save();
        res.json(updatedMenuItem);
    } else {
        res.status(404);
        throw new Error('Menu item not found');
    }
});

/**
 * @desc    Delete a menu item
 * @route   DELETE /api/menuitems/:id
 * @access  Private (Restaurant owner or Admin)
 */
const deleteMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
        const restaurant = await Restaurant.findById(menuItem.restaurant);
        if (!restaurant) {
            res.status(500);
            throw new Error('Associated restaurant not found for this menu item');
        }

        if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to delete this menu item');
        }

        await menuItem.deleteOne();
        res.json({ message: 'Menu item removed' });
    } else {
        res.status(404);
        throw new Error('Menu item not found');
    }
});

module.exports = {
    createMenuItem,
    getMenuItemsByRestaurant,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
};