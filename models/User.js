const mongoose = require("mongoose")
const { Schema } = mongoose

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordDigest: { type: String },
  },
  { timestamps: true }
)

// Create a model based on the schema
const User = mongoose.model("User", userSchema)

// Export the model
module.exports = User
