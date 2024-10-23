const mongoose = require("mongoose")

const AlbumSchema = new mongoose.Schema(
  {
    images: [{ type: String, required: true }], // Array of image URLs
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Album", AlbumSchema)
