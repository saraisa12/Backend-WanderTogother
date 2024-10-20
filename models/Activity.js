const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  location: String,
  photo: String
})

const Activity = mongoose.model('Activity', activitySchema)
module.exports = Activity
