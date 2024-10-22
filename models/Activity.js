const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  location: String,
  photo: String,
  votes: {
    type: Number,
    default: 0
  },
  comments: [commentSchema]
})

const Activity = mongoose.model('Activity', activitySchema)
module.exports = Activity
