const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../controllers/authController').generateToken;

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNo: user.phoneNo,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists && emailExists._id.toString() !== user._id.toString()) {
                res.status(400);
                throw new Error('That email is already registered by another user');
            }
            user.email = req.body.email;
        }

        if (req.body.phoneNo && req.body.phoneNo !== user.phoneNo) {
            const phoneExists = await User.findOne({ phoneNo: req.body.phoneNo });
            if (phoneExists && phoneExists._id.toString() !== user._id.toString()) {
                res.status(400);
                throw new Error('That phone number is already registered by another user');
            }
            user.phoneNo = req.body.phoneNo;
        } else if (req.body.phoneNo === null) {
             user.phoneNo = undefined;
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phoneNo: updatedUser.phoneNo,
            role: updatedUser.role,
            token: generateToken(updatedUser._id, updatedUser.role),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getUserProfile,
    updateUserProfile,
};