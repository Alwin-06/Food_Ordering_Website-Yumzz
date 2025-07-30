const sessionAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        req.user = { id: req.session.userId }; // so your controller can still use req.user.id
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized: No active session' });
    }
};

module.exports = { sessionAuth };
