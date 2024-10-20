const mongoose = require("mongoose")
const express = require("express")
const logger = require("morgan")
const cors = require("cors")

// Load environment variables from .env file
require("dotenv").config()

// Load DB
require("./config/db")

// PORT Configurations
const PORT = process.env.PORT || 4000

const app = express()

app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Import routes

const AuthRouter = require("./routes/authRouter")
const tripRouter = require("./routes/trip")

//mount routes
app.use("/auth", AuthRouter)
app.use("/uploads", express.static("uploads"))
app.use("/trip", tripRouter)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
