export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.session.user || !roles.includes(req.session.user.role)) {
            return res.status(403).json({
                message: `Role (${req.session.user ? req.session.user.role : "guest"}) is not allowed to access this resource`,
            });
        }
        next();
    };
};
