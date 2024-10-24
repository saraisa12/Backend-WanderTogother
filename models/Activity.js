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
  mapsUrl: { type: String, required: true },
  photoUrl: { type: String, required: true },
  votes: {
    happy: {
      type: Number,
      default: 0,
    },
    neutral: {
      type: Number,
      default: 0,
    },
    angry: {
      type: Number,
      default: 0,
    },
  },
  comments: [commentSchema],
  Date: {
    type: Date,
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
  },
})

const Activity = mongoose.model("Activity", activitySchema)
module.exports = Activity
