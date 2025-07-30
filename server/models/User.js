const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
    fullAddress: { type: String, required: true },
    landmark: { type: String },
    pincode: { type: String, required: true },
    contactNumber: { type: String, required: true },
    type: { type: String, required: true, enum: ['Home', 'Office', 'Other'] },
    isDefault: { type: Boolean, default: false },
});

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/.+@.+\..+/, 'Please enter a valid email address'],
        },
        phoneNo: {
            type: String,
            unique: true,
            sparse: true,
            match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [6, 'Password must be at least 6 characters long'],
        },
        role: {
            type: String,
            enum: ['user', 'restaurant', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);