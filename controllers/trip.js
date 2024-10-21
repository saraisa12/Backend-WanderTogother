const Trip = require("../models/Trip")
const User = require("../models/User")
const Invite = require("../models/Invite")
const nodemailer = require("nodemailer")

exports.trip_invite_post = async (req, res) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ message: "Email configuration is missing" })
  }

  const { tripId, email } = req.body
  const userId = res.locals.payload.id

  try {
    const trip = await Trip.findById(tripId)
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if the invite already exists
    const existingInvite = await Invite.findOne({
      trip: tripId,
      invitee: user._id,
    })
    if (existingInvite) {
      return res.status(400).json({ message: "User is already invited" })
    }

    // Create a new invite document
    const newInvite = new Invite({
      trip: tripId,
      invitee: user._id,
      status: "pending", // Optionally set initial status
    })
    await newInvite.save()

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Prepare mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You've Been Invited to a Trip!",
      text: `You've been invited to join a trip. Click here to view it: http://your-frontend-url.com/trip/${tripId}`,
    }

    console.log("Sending email to:", email) // Log email sending attempt
    console.log("Mail options:", mailOptions) // Log mail options

    // Send the email
    await transporter.sendMail(mailOptions)
    console.log("Email sent successfully") // Log success

    res
      .status(200)
      .json({ message: "User invited successfully and email sent" })
  } catch (error) {
    console.error("Error inviting user:", error)
    res
      .status(500)
      .json({ message: "Error inviting user", error: error.message })
  }
}

exports.trip_create_post = async (req, res) => {
  const userId = res.locals.payload.id
  console.log("Authenticated User:", userId) // Should show the user object now
  try {
    const { title, description, startDate, endDate, location } = req.body
    const image = req.file ? req.file.path : null

    console.log("Image path to be saved:", image)

    const creatorId = userId

    const trip = new Trip({
      title,
      description,
      startDate,
      endDate,
      location,
      image,
      creator: creatorId,
    })

    await trip.save()

    res.status(201).json({ message: "Trip created successfully", trip })
  } catch (error) {
    console.error("Error creating trip:", error)
    res
      .status(500)
      .json({ message: "Error creating trip", error: error.message })
  }
}

exports.get_user_trips = async (req, res) => {
  try {
    console.log("hiii")
    const userId = res.locals.payload.id

    // Find all trips created by the user or where the user is an invitee
    const trips = await Trip.find({
      $or: [
        { creator: userId }, // Trips created by the user
        { invitees: userId }, // Trips where the user is an invitee
      ],
    })

    console.log("Trips found:", trips)

    if (trips.length === 0) {
      return res.status(404).json({ message: "No trips found for this user." })
    }

    res.status(200).json({ trips })
  } catch (error) {
    console.error("Error fetching trips:", error)
    res
      .status(500)
      .json({ message: "Error fetching trips", error: error.message })
  }
}

exports.trip_details_get = async (req, res) => {
  try {
    const tripId = req.params.id
    const trip = await Trip.findById(tripId)
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" })
    }

    // Find all invitees for this trip
    const invites = await Invite.find({ trip: tripId }).populate(
      "invitee",
      "email"
    )

    const invitees = invites.map((invite) => ({
      email: invite.invitee.email,
      status: invite.status,
    }))

    res.status(200).json({ trip, invitees })
  } catch (error) {
    console.error("Error fetching trip details:", error)
    res
      .status(500)
      .json({ message: "Error fetching trip details", error: error.message })
  }
}

exports.update_invite_status = async (req, res) => {
  const { inviteId } = req.params
  const { status } = req.body // 'accepted' or 'declined'

  try {
    const invite = await Invite.findById(inviteId)
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" })
    }

    invite.status = status
    await invite.save()

    res.status(200).json({ message: "Invite status updated", invite })
  } catch (error) {
    console.error("Error updating invite status:", error)
    res
      .status(500)
      .json({ message: "Error updating invite status", error: error.message })
  }
}

exports.delete_invite = async (req, res) => {
  try {
    const { inviteId } = req.params

    // Find and delete the invite
    const invite = await Invite.findByIdAndDelete(inviteId)
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" })
    }

    res.status(200).json({ message: "Invite removed successfully" })
  } catch (error) {
    console.error("Error deleting invite:", error)
    res
      .status(500)
      .json({ message: "Failed to remove invite", error: error.message })
  }
}

exports.trip_delete_delete = async (req, res) => {
  try {
    const id = req.params.id
    const trip = await Trip.findByIdAndDelete(id)

    res.status(200).json({ message: "trip deleted successfully" })
  } catch (error) {
    console.error("Error deleting trip:", error)
    res.status(500).json({ error: error.message })
  }
}
