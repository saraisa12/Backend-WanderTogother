const mongoose = require('mongoose')
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env file
require('dotenv').config()

// Load DB configuration
require('./config/db') // Assuming you handle your MongoDB connection here

const PORT = process.env.PORT || 4000

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('Created uploads directory')
}

// Import routes
const AuthRouter = require('./routes/authRouter')
const tripRouter = require('./routes/trip')
const activityRouter = require('./routes/activity')

// Mount routes
app.use('/auth', AuthRouter)
app.use('/uploads', express.static('uploads')) // Serve static files from uploads
app.use('/trip', tripRouter)
app.use('/activity', activityRouter)

app.use('/uploads', express.static('uploads'))

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong', error: err.message })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
