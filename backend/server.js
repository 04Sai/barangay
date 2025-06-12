const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config()

const app = express()
const port = process.env.PORT || 1337

// Middleware
app.use(cors({
    origin: [
        'http://localhost:4000',
        'http://localhost:3000',
        'http://localhost:5173',  // Vite default
        'http://127.0.0.1:4000',
        'http://127.0.0.1:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware (for debugging)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB')
        // Initialize super admin after MongoDB connection
        initializeSuperAdmin()
    })
    .catch(err => console.error('MongoDB connection error:', err))

// Function to initialize super admin from environment variables
const initializeSuperAdmin = async () => {
    try {
        const Admin = require('./server/models/Admin')

        // Check if any admin exists
        const existingAdmin = await Admin.findOne({})
        if (existingAdmin) {
            console.log('Admin users already exist')
            return
        }

        // Get super admin credentials from environment
        const superAdminData = {
            username: process.env.SUPER_ADMIN_USERNAME || 'superadmin',
            email: process.env.SUPER_ADMIN_EMAIL || 'admin@barangay.gov.ph',
            password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!',
            firstName: process.env.SUPER_ADMIN_FIRSTNAME || 'Super',
            lastName: process.env.SUPER_ADMIN_LASTNAME || 'Admin',
            role: 'super_admin',
            permissions: ['all'],
            isActive: true,
            createdBy: null
        }

        // Create super admin (password will be hashed by the model's pre-save hook)
        const superAdmin = new Admin(superAdminData)
        await superAdmin.save()

        console.log('✅ Super admin created successfully!')
        console.log(`   Username: ${superAdmin.username}`)
        console.log(`   Email: ${superAdmin.email}`)
        console.log('   Please change the default password after first login')

    } catch (error) {
        console.error('❌ Error initializing super admin:', error.message)
    }
}

// Import routes
const authRoutes = require('./server/routes/auth')
const adminRoutes = require('./server/routes/admin')
const announcementRoutes = require('./server/routes/announcements')
const hotlineRoutes = require('./server/routes/hotlines')
const incidentReportRoutes = require('./server/routes/incidentReports')
const appointmentRoutes = require('./server/routes/appointments')
const residentRoutes = require('./server/routes/residents')

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'BSERS API Server Running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    })
})

// Use routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/hotlines', hotlineRoutes)
app.use('/api/incident-reports', incidentReportRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/residents', residentRoutes)

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../dist')))

// API 404 handler - only for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: `API route ${req.method} ${req.path} not found` })
})

// Catch-all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        query: req.query,
        body: req.body
    });

    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
            details: {
                url: req.url,
                method: req.method,
                query: req.query
            }
        })
    });
});

// Start server
app.listen(port, () => {
    console.log(`BSERS API Server listening on port ${port}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`)
    console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`)
})

module.exports = app;