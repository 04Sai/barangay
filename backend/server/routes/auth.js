const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { sendEmailVerification, sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, middleName, contactNumber, email, password, agreedToTerms } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
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

        // Generate email verification token
        const verificationToken = user.generateEmailVerificationToken();

        // Save user
        await user.save();

        // Send verification email - make this required for successful registration
        try {
            await sendEmailVerification(email, firstName, verificationToken);
            console.log('Verification email sent successfully');
            
            res.status(201).json({
                message: 'User registered successfully. Please check your email to verify your account.',
                emailSent: true,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified
                }
            });
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            
            // Delete the user if email sending fails
            await User.findByIdAndDelete(user._id);
            
            return res.status(500).json({ 
                message: 'Registration failed: Unable to send verification email. Please try again later.',
                emailSent: false 
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(401).json({
                message: 'Please verify your email before logging in.',
                emailNotVerified: true,
                email: user.email
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token with user type
        const token = jwt.sign(
            {
                userId: user._id,
                type: 'user'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Email verification route
router.get('/verify-email/:token', async (req, res) => {
    try {
        const { token } = req.params;

        console.log('Verifying email with token:', token);

        // Find user with this verification token
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            console.log('Invalid or expired token');

            // Check if there's a user with this token that's already verified
            const expiredTokenUser = await User.findOne({
                emailVerificationToken: token
            });

            if (expiredTokenUser && expiredTokenUser.isEmailVerified) {
                console.log('User already verified, returning success');
                return res.status(200).json({
                    message: 'Email already verified! You can now log in to your account.',
                    success: true,
                    alreadyVerified: true
                });
            }

            // Also check if user might be verified but token was cleared
            // This handles cases where the same verification link is clicked multiple times
            if (expiredTokenUser) {
                console.log('Token exists but expired, checking verification status');
                if (expiredTokenUser.isEmailVerified) {
                    return res.status(200).json({
                        message: 'Email already verified! You can now log in to your account.',
                        success: true,
                        alreadyVerified: true
                    });
                }
            }

            return res.status(400).json({
                message: 'Invalid or expired verification token',
                expired: true
            });
        }

        // Update user verification status
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        console.log('Email verified successfully for user:', user.email);

        // Send welcome email
        try {
            await sendWelcomeEmail(user.email, user.firstName);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }

        res.status(200).json({
            message: 'Email verified successfully! You can now log in to your account.',
            success: true
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: 'Email verification failed', error: error.message });
    }
});

// Resend verification email route
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        // Generate new verification token
        const verificationToken = user.generateEmailVerificationToken();
        await user.save();

        // Send verification email
        await sendEmailVerification(email, user.firstName, verificationToken);

        res.json({ message: 'Verification email sent successfully' });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: 'Failed to resend verification email', error: error.message });
    }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.json({
                message: 'If an account with this email exists, a password reset link has been sent.'
            });
        }

        // Generate password reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        // Send password reset email
        try {
            await sendPasswordResetEmail(email, user.firstName, resetToken);
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
        }

        res.json({
            message: 'If an account with this email exists, a password reset link has been sent.'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Failed to process forgot password request' });
    }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                message: 'Token and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Find user with valid reset token
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired password reset token'
            });
        }

        // Update password and clear reset token
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.json({
            message: 'Password has been reset successfully. You can now log in with your new password.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});

// Get user profile route
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        res.json({
            message: 'Profile retrieved successfully',
            user: req.user
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
});

// Update user profile route
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const updateData = req.body;

        // Remove fields that shouldn't be updated via this endpoint
        delete updateData.email;
        delete updateData.password;
        delete updateData.isEmailVerified;
        delete updateData.emailVerificationToken;
        delete updateData.emailVerificationExpires;

        // Handle profile picture upload
        if (updateData.profilePicture && updateData.profilePicture.data) {
            // Validate image data
            if (!updateData.profilePicture.data.startsWith('data:image/')) {
                return res.status(400).json({
                    message: 'Invalid image format. Please provide a valid base64 image.'
                });
            }

            // Validate file size (max 5MB when base64 decoded)
            const base64Data = updateData.profilePicture.data.split(',')[1];
            const sizeInBytes = (base64Data.length * 3) / 4;
            if (sizeInBytes > 5 * 1024 * 1024) {
                return res.status(400).json({
                    message: 'Image size should be less than 5MB'
                });
            }

            updateData.profilePicture.uploadedAt = new Date();
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Profile update error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
});

module.exports = router;
