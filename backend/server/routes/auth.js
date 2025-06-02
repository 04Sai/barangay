const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, middleName, contactNumber, email, password, agreedToTerms } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Check if terms are agreed
        if (!agreedToTerms) {
            return res.status(400).json({ message: 'You must agree to the terms and conditions' });
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            middleName,
            contactNumber,
            email,
            password,
            agreedToTerms
        });

        await user.save();

        // Return success without sending password
        const userWithoutPassword = { ...user.toObject() };
        delete userWithoutPassword.password;

        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        
        // Return user profile without password
        const userProfile = {
            id: user._id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            middleName: user.middleName || '',
            contactNumber: user.contactNumber || '',
            email: user.email || '',
            civilStatus: user.civilStatus || '',
            religion: user.religion || '',
            gender: user.gender || '',
            address: user.address || '',
            birthday: user.birthday || { month: '', day: '', year: '' },
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json({
            message: 'Profile retrieved successfully',
            user: userProfile
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Failed to retrieve profile', error: error.message });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        console.log('Profile update request received');
        console.log('User ID:', req.user._id);
        console.log('Request body:', req.body);

        const userId = req.user._id;
        const {
            firstName,
            lastName,
            middleName,
            contactNumber,
            civilStatus,
            religion,
            gender,
            address,
            birthday
        } = req.body;

        // Validate required fields that cannot be empty if they were required during registration
        if (firstName !== undefined && firstName.trim() === '') {
            return res.status(400).json({ message: 'First name cannot be empty' });
        }
        if (lastName !== undefined && lastName.trim() === '') {
            return res.status(400).json({ message: 'Last name cannot be empty' });
        }
        if (contactNumber !== undefined && contactNumber.trim() === '') {
            return res.status(400).json({ message: 'Contact number cannot be empty' });
        }

        // Build update object with only provided fields
        const updateData = {};
        
        if (firstName !== undefined) updateData.firstName = firstName.trim();
        if (lastName !== undefined) updateData.lastName = lastName.trim();
        if (middleName !== undefined) updateData.middleName = middleName.trim();
        if (contactNumber !== undefined) updateData.contactNumber = contactNumber.trim();
        if (civilStatus !== undefined) updateData.civilStatus = civilStatus;
        if (religion !== undefined) updateData.religion = religion.trim();
        if (gender !== undefined) updateData.gender = gender;
        if (address !== undefined) updateData.address = address.trim();

        // Handle birthday validation
        if (birthday && typeof birthday === 'object') {
            const { month, day, year } = birthday;
            
            // Reset birthday if all fields are empty
            if (!month && !day && !year) {
                updateData.birthday = { month: '', day: '', year: '' };
            } else {
                // Validate individual fields only if they have values
                if (month && !/^(0[1-9]|1[0-2])$/.test(month)) {
                    return res.status(400).json({ message: 'Invalid month format. Use MM (01-12)' });
                }
                
                if (day && !/^(0[1-9]|[12][0-9]|3[01])$/.test(day)) {
                    return res.status(400).json({ message: 'Invalid day format. Use DD (01-31)' });
                }
                
                if (year && !/^\d{4}$/.test(year)) {
                    return res.status(400).json({ message: 'Invalid year format. Use YYYY' });
                }

                // Validate complete date only if all parts are provided
                if (month && day && year) {
                    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    if (date.getMonth() !== parseInt(month) - 1 || date.getDate() !== parseInt(day)) {
                        return res.status(400).json({ message: 'Invalid date combination' });
                    }
                    
                    // Check if date is not in the future
                    if (date > new Date()) {
                        return res.status(400).json({ message: 'Birthday cannot be in the future' });
                    }
                }

                updateData.birthday = { 
                    month: month || '', 
                    day: day || '', 
                    year: year || '' 
                };
            }
        }

        updateData.updatedAt = new Date();

        console.log('Update data:', updateData);

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { 
                new: true, 
                runValidators: false, // Disable validators to avoid required field conflicts
                select: '-password' // Exclude password from response
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User updated successfully');

        // Format response similar to profile GET
        const userProfile = {
            id: updatedUser._id,
            firstName: updatedUser.firstName || '',
            lastName: updatedUser.lastName || '',
            middleName: updatedUser.middleName || '',
            contactNumber: updatedUser.contactNumber || '',
            email: updatedUser.email || '',
            civilStatus: updatedUser.civilStatus || '',
            religion: updatedUser.religion || '',
            gender: updatedUser.gender || '',
            address: updatedUser.address || '',
            birthday: updatedUser.birthday || { month: '', day: '', year: '' },
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };

        res.status(200).json({
            message: 'Profile updated successfully',
            user: userProfile
        });
    } catch (error) {
        console.error('Profile update error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid data format' });
        }
        
        res.status(500).json({ message: 'Profile update failed', error: error.message });
    }
});

// Change password endpoint
router.put('/change-password', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long' });
        }

        // Get user with password
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ message: 'Password change failed', error: error.message });
    }
});

module.exports = router;
