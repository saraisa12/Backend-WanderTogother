const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Note', NoteSchema)
