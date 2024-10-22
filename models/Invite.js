// models/Invite.js
const mongoose = require("mongoose")

const InviteSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
  invitee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  invitedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Invite", InviteSchema)
