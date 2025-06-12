const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Check if user is already verified
const checkUserVerificationStatus = async (email) => {
    try {
        // This should be called from auth controller with proper User model
        // Return helper function for auth controller to use
        return {
            checkUser: async (User) => {
                const user = await User.findOne({ email: email.toLowerCase() });
                if (user && user.isEmailVerified) {
                    return { isAlreadyVerified: true, user };
                }
                return { isAlreadyVerified: false, user };
            }
        };
    } catch (error) {
        return { isAlreadyVerified: false };
    }
};

// Handle verification response - helper for auth controller
const getVerificationResponse = (isAlreadyVerified, firstName, isTokenExpired = false) => {
    if (isAlreadyVerified) {
        return {
            success: true,
            message: 'Email already verified. You can now log in.',
            redirectTo: '/login',
            showSuccessMessage: true,
            alreadyVerified: true
        };
    }
    
    if (isTokenExpired) {
        return {
            success: false,
            message: 'Verification link has expired. Please request a new one.',
            redirectTo: '/verify-email-failed',
            expired: true
        };
    }
    
    return {
        success: false,
        message: 'Invalid or expired verification token.',
        redirectTo: '/verify-email-failed'
    };
};

// Send email verification with improved messaging
const sendEmailVerification = async (email, firstName, verificationToken) => {
    try {
        console.log('Attempting to send email verification to:', email);
        console.log('SendGrid API Key configured:', !!process.env.SENDGRID_API_KEY);
        
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:4000'}/verify-email?token=${verificationToken}`;
        
        const msg = {
            to: email,
            from: 'ic.mharbhibrando.delatorre@cvsu.edu.ph',
            subject: 'Verify Your Email Address - Barangay Dulong Bayan',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
                        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                        .button { display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                        .note { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to Barangay Dulong Bayan!</h1>
                        </div>
                        <div class="content">
                            <h2>Hello, ${firstName}!</h2>
                            <p>Thank you for registering with the Barangay Smart Emergency Response System (BSERS). To complete your registration, please verify your email address by clicking the button below:</p>
                            
                            <div style="text-align: center;">
                                <a href="${verificationUrl}" class="button">Verify Email Address</a>
                            </div>
                            
                            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
                            
                            <div class="note">
                                <strong>⚠️ Important:</strong> This verification link can only be used once and will expire in 24 hours. Once you've verified your email, you can proceed to log in to your account.
                            </div>
                            
                            <p>If you didn't create this account, please ignore this email.</p>
                            
                            <p>Best regards,<br>Barangay Dulong Bayan Team</p>
                        </div>
                        <div class="footer">
                            <p>© 2024 Barangay Dulong Bayan. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        console.log('Sending email with config:', {
            to: msg.to,
            from: msg.from,
            subject: msg.subject
        });

        const result = await sgMail.send(msg);
        console.log('Email verification sent successfully:', result[0].statusCode);
        return { success: true, messageId: result[0].headers['x-message-id'] };
    } catch (error) {
        console.error('Error sending email verification:', error);
        
        // Log detailed error information
        if (error.response && error.response.body && error.response.body.errors) {
            console.error('SendGrid Error Details:', error.response.body.errors);
            error.response.body.errors.forEach((err, index) => {
                console.error(`Error ${index + 1}:`, err);
            });
        }
        
        throw new Error('Failed to send verification email');
    }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, firstName) => {
    try {
        console.log('Attempting to send welcome email to:', email);
        
        const msg = {
            to: email,
            from: 'ic.mharbhibrando.delatorre@cvsu.edu.ph', // Use your verified Gmail address
            subject: 'Welcome to Barangay Dulong Bayan!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
                        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                        .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Welcome Aboard!</h1>
                        </div>
                        <div class="content">
                            <h2>Hello, ${firstName}!</h2>
                            <p>Your email has been successfully verified! Welcome to the Barangay Smart Emergency Response System (BSERS).</p>
                            
                            <h3>What you can do now:</h3>
                            <div class="feature">
                                <strong>🚨 Emergency Services:</strong> Access medical assistance, fire station, police station, and more emergency services.
                            </div>
                            <div class="feature">
                                <strong>📋 Document Services:</strong> Request barangay clearances, certificates, and other official documents.
                            </div>
                            <div class="feature">
                                <strong>📢 Announcements:</strong> Stay updated with the latest barangay news and announcements.
                            </div>
                            <div class="feature">
                                <strong>📅 Appointments:</strong> Schedule appointments for various barangay services.
                            </div>
                            
                            <p>You can now log in to your account and start using all the available services.</p>
                            
                            <p>If you have any questions or need assistance, feel free to contact us.</p>
                            
                            <p>Best regards,<br>Barangay Dulong Bayan Team</p>
                        </div>
                        <div class="footer">
                            <p>© 2024 Barangay Dulong Bayan. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const result = await sgMail.send(msg);
        console.log('Welcome email sent successfully:', result[0].statusCode);
        return { success: true, messageId: result[0].headers['x-message-id'] };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

// Send password reset email
const sendPasswordResetEmail = async (email, firstName, resetToken) => {
    try {
        console.log('Attempting to send password reset email to:', email);
        
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:4000'}/reset-password/${resetToken}`;
        
        const msg = {
            to: email,
            from: 'ic.mharbhibrando.delatorre@cvsu.edu.ph',
            subject: 'Password Reset Request - Barangay Dulong Bayan',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
                        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                        .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔒 Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <h2>Hello, ${firstName}!</h2>
                            <p>We received a request to reset your password for your Barangay Smart Emergency Response System account.</p>
                            
                            <p>Click the button below to reset your password:</p>
                            
                            <div style="text-align: center;">
                                <a href="${resetUrl}" class="button">Reset Password</a>
                            </div>
                            
                            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 5px;">${resetUrl}</p>
                            
                            <div class="warning">
                                <strong>⚠️ Important:</strong> This password reset link will expire in 1 hour. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
                            </div>
                            
                            <p>For security reasons, if you continue to receive unwanted password reset emails, please contact our support team.</p>
                            
                            <p>Best regards,<br>Barangay Dulong Bayan Team</p>
                        </div>
                        <div class="footer">
                            <p>© 2024 Barangay Dulong Bayan. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        console.log('Sending password reset email with config:', {
            to: msg.to,
            from: msg.from,
            subject: msg.subject
        });

        const result = await sgMail.send(msg);
        console.log('Password reset email sent successfully:', result[0].statusCode);
        return { success: true, messageId: result[0].headers['x-message-id'] };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        
        // Log detailed error information
        if (error.response && error.response.body && error.response.body.errors) {
            console.error('SendGrid Error Details:', error.response.body.errors);
            error.response.body.errors.forEach((err, index) => {
                console.error(`Error ${index + 1}:`, err);
            });
        }
        
        throw new Error('Failed to send password reset email');
    }
};

module.exports = {
    sendEmailVerification,
    sendWelcomeEmail,
    checkUserVerificationStatus,
    getVerificationResponse,
    sendPasswordResetEmail
};