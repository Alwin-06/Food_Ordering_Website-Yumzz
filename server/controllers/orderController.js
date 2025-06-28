const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private (User)
 */
const createOrder = asyncHandler(async (req, res) => {
    const {
        orderItems,
        deliveryAddress,
        restaurantId,
        totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        res.status(404);
        throw new Error('Restaurant not found');
    }
    const itemsFromDB = await MenuItem.find({
        _id: {
            $in: orderItems.map(item => item.menuItem)
        }
    });

    let calculatedTotalPrice = 0;
    const validatedOrderItems = orderItems.map(item => {
        const dbItem = itemsFromDB.find(dbI => dbI._id.toString() === item.menuItem.toString());

        if (!dbItem || !dbItem.isAvailable) {
            res.status(400);
            throw new Error(`Menu item '${item.name}' not found or not available`);
        }
        const itemPrice = dbItem.price;
        calculatedTotalPrice += itemPrice * item.qty;

        return {
            name: dbItem.name,
            qty: item.qty,
            image: dbItem.image,
            price: itemPrice,
            menuItem: dbItem._id,
        };
    });

    if (Math.abs(calculatedTotalPrice - totalPrice) > 0.01) {
        console.warn(`Client provided total (${totalPrice}) differs from calculated total (${calculatedTotalPrice})`);
    }


    const order = new Order({
        user: req.user._id,
        restaurant: restaurantId,
        orderItems: validatedOrderItems,
        deliveryAddress,
        totalPrice: calculatedTotalPrice,
        orderStatus: 'Pending',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

/**
 * @desc    Get all orders for the logged-in user
 * @route   GET /api/orders/myorders
 * @access  Private (User)
 */
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).populate('restaurant', 'name address');
    res.json(orders);
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private (User, Restaurant owner of the order, or Admin)
 */
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email phoneNo')
        .populate('restaurant', 'name address');

    if (order) {
        if (order.user.toString() === req.user._id.toString() ||
            order.restaurant.owner.toString() === req.user._id.toString() ||
            req.user.role === 'admin') {
            res.json(order);
        } else {
            res.status(403);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

/**
 * @desc    Get all orders (for Admin or Restaurant Owner)
 * @route   GET /api/orders
 * @access  Private (Admin or Restaurant Owner)
 */
const getOrders = asyncHandler(async (req, res) => {
    let query = {};
    if (req.user.role === 'restaurant') {
        const restaurantsOwned = await Restaurant.find({ owner: req.user._id }).select('_id');
        const restaurantIds = restaurantsOwned.map(r => r._id);
        if (restaurantIds.length === 0) {
            return res.json([]);
        }
        query.restaurant = { $in: restaurantIds };
    }

    const orders = await Order.find(query)
        .populate('user', 'id name email')
        .populate('restaurant', 'name address');
    res.json(orders);
});

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private (Admin or Restaurant owner)
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (order) {
        const restaurant = await Restaurant.findById(order.restaurant);
        if (!restaurant) {
            res.status(500);
            throw new Error('Associated restaurant not found for this order');
        }
        if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to update this order status');
        }

        const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(orderStatus)) {
            res.status(400);
            throw new Error(`Invalid order status. Must be one of: ${validStatuses.join(', ')}`);
        }

        order.orderStatus = orderStatus;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderStatus,
};