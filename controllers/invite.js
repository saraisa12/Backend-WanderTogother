const Invite = require("../models/Invite")
const Trip = require("../models/Trip")
const User = require("../models/User")
const nodemailer = require("nodemailer")

exports.invite_create_post = async (req, res) => {
  const { tripId, email } = req.body
  const userId = res.locals.payload.id

  try {
    // Check if the trip exists
    const trip = await Trip.findById(tripId)
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" })
    }

    // Check if the invitee exists
    const invitee = await User.findOne({ email })
    if (!invitee) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if the invite already exists
    const existingInvite = await Invite.findOne({
      trip: tripId,
      invitee: invitee._id,
    })
    if (existingInvite) {
      return res.status(400).json({ message: "User is already invited" })
    }

    // Create a new invite
    const newInvite = new Invite({
      trip: tripId,
      invitee: invitee._id,
      status: "pending", // You can set this based on your requirements
    })

    await newInvite.save()

    // Send an email notification (if configured)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You've Been Invited to a Trip!",
      text: `You've been invited to join the trip: ${trip.title}.`,
    }

    await transporter.sendMail(mailOptions)

    res
      .status(201)
      .json({ message: "Invite created successfully", invite: newInvite })
  } catch (error) {
    console.error("Error creating invite:", error)
    res
      .status(500)
      .json({ message: "Error creating invite", error: error.message })
  }
}

exports.invite_list_get = async (req, res) => {
  const { tripId } = req.params

  console.log({ tripId })
  // Get the trip ID from the route parameters

  try {
    // Check if the trip exists
    const trip = await Trip.findById(tripId)
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" })
    }

    // Find invites for this trip and populate invitee information
    const invites = await Invite.find({ trip: tripId }).populate(
      "invitee",
      "email"
    )

    res.set("Cache-Control", "no-store")

    // If no invites found
    if (invites.length === 0) {
      return res
        .status(200)
        .json({ message: "No invites found for this trip." })
    }

    // Return the invites with their statuses
    res.status(200).json({ invites })
  } catch (error) {
    console.error("Error fetching invites:", error)
    res
      .status(500)
      .json({ message: "Error fetching invites", error: error.message })
  }
}

exports.delete_invite = async (req, res) => {
  const inviteId = req.params.id

  try {
    const invite = await Invite.findByIdAndDelete(inviteId)

    if (!invite) {
      return res.status(404).json({ message: "Invite not found." })
    }

    res.status(200).json({ message: "Invite deleted successfully." })
  } catch (error) {
    console.error("Error deleting invite:", error)
    res
      .status(500)
      .json({ message: "Error deleting invite", error: error.message })
  }
}
