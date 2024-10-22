const mongoose = require("mongoose")

const tripSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (v) {
          return v > this.startDate // Ensure endDate is after startDate
        },
        message: "End date must be after start date.",
      },
    },
    location: {
      type: String,
    },
    image: {
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
)

const Trip = mongoose.model("Trip", tripSchema)

module.exports = Trip
