const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

const app = express()
const port = process.env.PORT

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err))

// Import routes
const authRoutes = require('./server/routes/auth')

// Root route
app.get('/', (req, res) => {
    res.send('BSERS API')
})

// Use routes
app.use('/api/auth', authRoutes)

// Start server
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})