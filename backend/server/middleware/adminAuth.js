const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'Admin access token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token is for admin
        if (decoded.type !== 'admin') {
            return res.status(403).json({
                message: 'Invalid admin token'
            });
        }

        // Get admin from database
        const admin = await Admin.findById(decoded.adminId).select('-password');
        if (!admin) {
            return res.status(401).json({
                message: 'Invalid admin token'
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(401).json({
                message: 'Admin account is deactivated'
            });
        }

        req.admin = admin;
        req.adminPermissions = decoded.permissions || [];
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid admin token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                message: 'Admin session expired. Please login again.'
            });
        }
        return res.status(500).json({
            message: 'Admin authentication error',
            error: error.message
        });
    }
};

const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({
                message: 'Admin authentication required'
            });
        }

        // Super admin has all permissions
        if (req.admin.role === 'super_admin') {
            return next();
        }

        // Check if admin has required permission
        if (!req.adminPermissions.includes(permission)) {
            return res.status(403).json({
                message: `Permission denied. Required permission: ${permission}`
            });
        }

        next();
    };
};

module.exports = {
    authenticateAdmin,
    requirePermission
};
