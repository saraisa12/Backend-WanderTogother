const mongoose = require('mongoose')
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

require('dotenv').config()

require('./config/db')

const PORT = process.env.PORT || 4000

const app = express()

//herre goes
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('Created uploads directory')
}

const AuthRouter = require('./routes/authRouter')
const tripRouter = require('./routes/Trip')
const activityRouter = require('./routes/activity')

app.use('/auth', AuthRouter)
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
