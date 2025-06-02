const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

const app = express()
const port = process.env.PORT || 1337

// Middleware
app.use(cors({
    origin: ['http://localhost:4000'], // Add your frontend URLs
    credentials: true
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
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err))

// Import routes
const authRoutes = require('./server/routes/auth')

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

// 404 handler - use a simple string pattern instead of wildcard
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` })
})

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(error.status || 500).json({
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
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