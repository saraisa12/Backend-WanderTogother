const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: "User", // Referencing the User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  location: String,
  photo: String,
  votes: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
  tripId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Trip
    ref: "Trip",
    required: true,
  },
})

const Activity = mongoose.model("Activity", activitySchema)
module.exports = Activity
