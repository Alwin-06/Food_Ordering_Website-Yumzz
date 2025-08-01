const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token; // ✅ Read token from cookie

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');
        req.user.role = decoded.role;

        next();
    } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

module.exports = { protect };














// const jwt = require('jsonwebtoken');
// const asyncHandler = require('express-async-handler');
// const User = require('../models/User');

// const protect = asyncHandler(async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             // token = req.headers.authorization.split(' ')[1];
//             const token = req.cookies.token;
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);

//             req.user = await User.findById(decoded.id).select('-password');
//             req.user.role = decoded.role;

//             next();
//         } catch (error) {
//             console.error(error);
//             res.status(401);
//             throw new Error('Not authorized, token failed');
//         }
//     }

//     if (!token) {
//         res.status(401);
//         throw new Error('Not authorized, no token');
//     }
// });

// module.exports = { protect };