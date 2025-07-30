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
            addresses: user.addresses,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc    Add a new address to user profile
 * @route   POST /api/users/profile/address
 * @access  Private
 */
const addAddressToProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {

        if (!user.addresses) {
            user.addresses = [];
        }

        const newAddress = {
            fullAddress: req.body.fullAddress,
            landmark: req.body.landmark,
            pincode: req.body.pincode,
            contactNumber: req.body.contactNumber,
            type: req.body.type,
            isDefault: req.body.isDefault,
        };

        if (newAddress.isDefault) {
            user.addresses.forEach(addr => { addr.isDefault = false; });
        }
        
        user.addresses.push(newAddress);
        await user.save();
        
        res.status(201).json(user.addresses); // Return the updated addresses array

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

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password'); // Fetch all users, exclude password
    res.json(users);
});

/**
 * @desc    Delete an address from user profile
 * @route   DELETE /api/users/profile/address/:addressId
 * @access  Private
 */
const deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const addressIdToDelete = req.params.addressId;
        const address = user.addresses.id(addressIdToDelete);

        if (!address) {
            res.status(404);
            throw new Error('Address not found');
        }

        address.remove();
        await user.save();
        res.status(200).json(user.addresses);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

/**
 * @desc    Set an address as the default
 * @route   PUT /api/users/profile/default-address
 * @access  Private
 */
const setDefaultAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { addressId } = req.body;

    if (user) {
        const addressToSetDefault = user.addresses.id(addressId);
        if (!addressToSetDefault) {
            res.status(404);
            throw new Error('Address not found');
        }

        // Set all other addresses to not be default
        user.addresses.forEach(addr => {
            addr.isDefault = addr._id.toString() === addressId;
        });

        await user.save();
        res.status(200).json(user.addresses);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    addAddressToProfile,
    deleteAddress,
    setDefaultAddress,
};