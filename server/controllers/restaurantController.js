const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

/**
 * @desc    Create a new restaurant
 * @route   POST /api/restaurants
 * @access  Private (Admin or Restaurant role)
 */
const createRestaurant = asyncHandler(async (req, res) => {

    const { name, description, cuisineType, image, address, available } = req.body;

    const restaurantExists = await Restaurant.findOne({ name });
    if (restaurantExists) {
        res.status(400);
        throw new Error('Restaurant with this name already exists');
    }

    let ownerId = req.user._id;
    if (req.user.role === 'admin' && req.body.ownerId) {
        const specifiedOwner = await User.findById(req.body.ownerId);
        if (specifiedOwner && specifiedOwner.role === 'restaurant') {
            ownerId = req.body.ownerId;
        } else {
            res.status(400);
            throw new new Error('Provided ownerId is invalid or does not belong to a restaurant user');
        }
    } else if (req.user.role !== 'restaurant' && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to create a restaurant');
    }


    const restaurant = await Restaurant.create({
        name,
        description,
        cuisineType,
        image,
        address,
        available: available !== undefined ? available : true,
        owner: ownerId,
    });

    if (restaurant) {
        res.status(201).json({
            _id: restaurant._id,
            name: restaurant.name,
            description: restaurant.description,
            cuisineType: restaurant.cuisineType,
            image: restaurant.image,
            address: restaurant.address,
            available: restaurant.available,
            owner: restaurant.owner,
        });
    } else {
        res.status(400);
        throw new Error('Invalid restaurant data');
    }
});

/**
 * @desc    Get all restaurants
 * @route   GET /api/restaurants
 * @access  Public
 */
const getRestaurants = asyncHandler(async (req, res) => {
    const { location, cuisineType, available } = req.query;
    let query = {};

    if (location) {
        query.address = { $regex: location, $options: 'i' };
    }
    if (cuisineType) {
        query.cuisineType = { $regex: cuisineType, $options: 'i' };
    }
    if (available === 'false') {
        if (req.user && req.user.role === 'admin') {
        } else {
            query.available = true;
        }
    } else {
        query.available = true;
    }


    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
});

/**
 * @desc    Get a single restaurant by ID
 * @route   GET /api/restaurants/:id
 * @access  Public
 */
const getRestaurantById = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant && restaurant.available) {
        res.json(restaurant);
    } else if (restaurant && !restaurant.available && req.user && req.user.role === 'admin') {
         res.json(restaurant);
    }
    else {
        res.status(404);
        throw new Error('Restaurant not found or not available');
    }
});

/**
 * @desc    Update a restaurant
 * @route   PUT /api/restaurants/:id
 * @access  Private (Admin or Restaurant owner)
 */
const updateRestaurant = asyncHandler(async (req, res) => {
    const { name, description, cuisineType, image, address, available } = req.body;

    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
        if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to update this restaurant');
        }

        if (name && name !== restaurant.name) {
            const restaurantExists = await Restaurant.findOne({ name });
            if (restaurantExists) {
                res.status(400);
                throw new Error('Another restaurant with this name already exists');
            }
        }

        restaurant.name = name || restaurant.name;
        restaurant.description = description || restaurant.description;
        restaurant.cuisineType = cuisineType || restaurant.cuisineType;
        restaurant.image = image || restaurant.image;
        restaurant.address = address || restaurant.address;
        if (available !== undefined && (req.user.role === 'admin' || restaurant.owner.toString() === req.user._id.toString())) {
             restaurant.available = available;
        }


        const updatedRestaurant = await restaurant.save();
        res.json(updatedRestaurant);
    } else {
        res.status(404);
        throw new Error('Restaurant not found');
    }
});

/**
 * @desc    Delete a restaurant
 * @route   DELETE /api/restaurants/:id
 * @access  Private (Admin or Restaurant owner)
 */
const deleteRestaurant = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
        if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to delete this restaurant');
        }

        await restaurant.deleteOne();
        res.json({ message: 'Restaurant removed' });
    } else {
        res.status(404);
        throw new Error('Restaurant not found');
    }
});

module.exports = {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
};