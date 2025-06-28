const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const generateToken = (id, role) => {
    try {
        return jwt.sign({ id, role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
    } catch (error) {
        console.log(error);
        throw new Error('Token creation failed', error);
    }
};
/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error('Validation failed: ' + errors.array().map(err => err.msg).join(', '));
    }

    const { name, email, phoneNo, password, role } = req.body;

    const userExistsByEmail = await User.findOne({ email });
    if (userExistsByEmail) {
        res.status(400);
        throw new Error('User with that email already exists');
    }

    if (phoneNo) {
        const userExistsByPhone = await User.findOne({ phoneNo });
        if (userExistsByPhone) {
            res.status(400);
            throw new Error('User with that phone number already exists');
        }
    }

    const user = await User.create({
        name,
        email,
        phoneNo,
        password,
        role: role || 'user',
    });

    if (user) {
        res.status(201).json({
            message: 'User registered successfully. Please log in.',
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNo: user.phoneNo,
            role: user.role,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

/**
 * @desc    Authenticate user & send token via cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.role);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message: 'Login successful',
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNo: user.phoneNo,
            role: user.role,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

/**
 * @desc    Logout user (clears token cookie)
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};
