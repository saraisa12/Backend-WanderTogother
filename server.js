const express = require('express')
const logger = require('morgan')
const cors = require('cors')
require('dotenv').config() // Load environment variables from .env file

const connectDB = require('./config/db') // Load the DB connection file

// Initialize express
const app = express()

// Database Connection
connectDB() // Establish a connection to MongoDB

// Middleware
app.use(cors()) // Enable Cross-Origin Resource Sharing
app.use(logger('dev')) // Logging middleware for development
app.use(express.json()) // Parse incoming JSON requests
app.use(express.urlencoded({ extended: false })) // Parse incoming URL-encoded data

// Logging incoming requests
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`)
  next()
})

// Import routes
const AuthRouter = require('./routes/authRouter') // Import authentication routes
const activityRoutes = require('./routes/activity') // Import activity routes

// Mount routes
app.use('/auth', AuthRouter) // Mount authentication routes at /auth
app.use('/api', activityRoutes) // Mount activity routes at /api

// PORT Configurations
const PORT = process.env.PORT || 4000 // Use the PORT from .env or default to 4000

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`) // Log the port the server is running on
})
