const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number },
  date: { type: Date, default: Date.now },
  location: { type: String, required: true },
  description: { type: String },
  reactions: {
    like: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    angry: { type: Number, default: 0 }
  },
  mapLink: { type: String }
})

module.exports = mongoose.model('Activity', activitySchema)
