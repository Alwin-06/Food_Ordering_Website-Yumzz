const authorizeRoles = (...roles) => {
    
    return (req, res, next) => {
        console.log('Role check:', req.user?.role, 'allowed:', roles);
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`User role ${req.user ? req.user.role : 'unauthenticated'} is not authorized to access this resource.`);
        }
        next();
    };
};

module.exports = authorizeRoles;