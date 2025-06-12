const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const router = express.Router()

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findById(decoded.id).select('-password')

        if (!admin) {
            return res.status(401).json({ message: 'Invalid token. Admin not found.' })
        }

        if (!admin.isActive) {
            return res.status(401).json({ message: 'Account is deactivated.' })
        }

        req.admin = admin
        next()
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.', error: error.message })
    }
}

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' })
        }

        // Find admin by username or email
        const admin = await Admin.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        })

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Check if account is active
        if (!admin.isActive) {
            return res.status(401).json({ message: 'Account is deactivated. Contact administrator.' })
        }

        // Check if account is locked
        if (admin.isLocked()) {
            return res.status(401).json({ message: 'Account is temporarily locked due to too many failed login attempts.' })
        }

        // Verify password
        const isValidPassword = await admin.comparePassword(password)

        if (!isValidPassword) {
            await admin.incLoginAttempts()
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Reset login attempts and update last login
        await admin.resetLoginAttempts()

        // Generate JWT token
        const token = jwt.sign(
            {
                id: admin._id,
                username: admin.username,
                role: admin.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions,
                lastLogin: admin.lastLogin
            }
        })
    } catch (error) {
        console.error('Admin login error:', error)
        res.status(500).json({ message: 'Login failed', error: error.message })
    }
})

// Create new admin (only accessible by super admin or admin with user_management permission)
router.post('/create-admin', authenticateAdmin, async (req, res) => {
    try {
        // Check if current user has permission to create admins
        if (req.admin.role !== 'super_admin' && !req.admin.permissions.includes('user_management')) {
            return res.status(403).json({ message: 'Insufficient permissions to create admin accounts' })
        }

        const { username, password, firstName, lastName, email, role, permissions } = req.body

        // Validate required fields
        if (!username || !password || !firstName || !lastName || !email) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        // Check if username already exists
        const existingAdmin = await Admin.findOne({ username })
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already exists' })
        }

        // Check if email already exists
        const existingEmail = await Admin.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' })
        }

        // Validate role
        const validRoles = ['admin', 'staff', 'moderator']
        const adminRole = role || 'staff'
        if (!validRoles.includes(adminRole)) {
            return res.status(400).json({ message: 'Invalid role' })
        }

        // Set default permissions based on role
        let adminPermissions = permissions || []
        if (adminPermissions.length === 0) {
            switch (adminRole) {
                case 'admin':
                    adminPermissions = ['user_management', 'announcements', 'hotlines', 'incident_reports', 'appointments', 'residents']
                    break
                case 'staff':
                    adminPermissions = ['announcements', 'hotlines', 'incident_reports', 'appointments']
                    break
                case 'moderator':
                    adminPermissions = ['announcements', 'incident_reports']
                    break
                default:
                    adminPermissions = ['basic']
            }
        }

        // Create new admin (password will be hashed by model pre-save hook)
        const newAdmin = new Admin({
            username,
            password,
            firstName,
            lastName,
            email,
            role: adminRole,
            permissions: adminPermissions,
            isActive: true,
            createdBy: req.admin._id
        })

        await newAdmin.save()

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                id: newAdmin._id,
                username: newAdmin.username,
                firstName: newAdmin.firstName,
                lastName: newAdmin.lastName,
                email: newAdmin.email,
                role: newAdmin.role,
                permissions: newAdmin.permissions,
                isActive: newAdmin.isActive,
                createdAt: newAdmin.createdAt
            }
        })
    } catch (error) {
        console.error('Create admin error:', error)
        res.status(500).json({ message: 'Error creating admin', error: error.message })
    }
})

// Get all admins (for admin management)
router.get('/admins', authenticateAdmin, async (req, res) => {
    try {
        if (req.admin.role !== 'super_admin' && !req.admin.permissions.includes('user_management')) {
            return res.status(403).json({ message: 'Insufficient permissions to view admin accounts' })
        }

        const admins = await Admin.find({}, '-password')
            .populate('createdBy', 'username firstName lastName')
            .sort({ createdAt: -1 })

        res.json({
            success: true,
            admins: admins
        })
    } catch (error) {
        console.error('Get admins error:', error)
        res.status(500).json({ message: 'Error fetching admin accounts', error: error.message })
    }
})

// Get admin profile
router.get('/profile', authenticateAdmin, async (req, res) => {
    try {
        res.json({
            success: true,
            admin: {
                id: req.admin._id,
                username: req.admin.username,
                firstName: req.admin.firstName,
                lastName: req.admin.lastName,
                email: req.admin.email,
                contactNumber: req.admin.contactNumber,
                role: req.admin.role,
                permissions: req.admin.permissions,
                lastLogin: req.admin.lastLogin,
                createdAt: req.admin.createdAt
            }
        })
    } catch (error) {
        console.error('Get admin profile error:', error)
        res.status(500).json({ message: 'Error fetching admin profile', error: error.message })
    }
})

// Update admin profile
router.put('/profile', authenticateAdmin, async (req, res) => {
    try {
        const { firstName, lastName, email, contactNumber } = req.body;

        // Check if email is being changed and already exists
        if (email !== req.admin.email) {
            const existingEmail = await Admin.findOne({ email, _id: { $ne: req.admin._id } });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already in use by another account'
                });
            }
        }

        // Update admin
        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.admin._id,
            {
                $set: {
                    firstName,
                    lastName,
                    email,
                    contactNumber,
                    updatedAt: new Date()
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            admin: {
                id: updatedAdmin._id,
                username: updatedAdmin.username,
                firstName: updatedAdmin.firstName,
                lastName: updatedAdmin.lastName,
                email: updatedAdmin.email,
                contactNumber: updatedAdmin.contactNumber,
                role: updatedAdmin.role,
                permissions: updatedAdmin.permissions,
                lastLogin: updatedAdmin.lastLogin,
                updatedAt: updatedAdmin.updatedAt
            }
        });
    } catch (error) {
        console.error('Update admin profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

// Change admin password
router.put('/change-password', authenticateAdmin, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        // Get admin with password
        const admin = await Admin.findById(req.admin._id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Verify current password
        const isValidPassword = await admin.comparePassword(currentPassword);

        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        admin.password = newPassword;
        await admin.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error.message
        });
    }
});

module.exports = router
