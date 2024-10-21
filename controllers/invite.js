const Trip = require("../models/Trip")
const User = require("../models/User")
const Invite = require("../models/Invite")
const nodemailer = require("nodemailer")

exports.get_invites = async (req, res) => {
  const tripId = req.params.id

  try {
    // Fetch all invites for the trip and populate the invitee's email
    const invites = await Invite.find({ trip: tripId }).populate("invitee")

    if (!invites.length) {
      return res
        .status(404)
        .json({ message: "No invites found for this trip." })
    }

    res.status(200).json({ invites })
  } catch (error) {
    console.error("Error fetching invites:", error)
    res
      .status(500)
      .json({ message: "Error fetching invites", error: error.message })
  }
}

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

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You've Been Invited to a Trip!",
      text: `You've been invited to join a trip. Click here to respond: http://localhost:5173/invite/${Invite._id}`,
    }

    console.log("Sending email to:", email)
    console.log("Mail options:", mailOptions)

    await transporter.sendMail(mailOptions)
    console.log("Email sent successfully")

    res.status(200).json({
      message: "User invited successfully and email sent",
      invite: newInvite,
    })
  } catch (error) {
    console.error("Error inviting user:", error)
    res
      .status(500)
      .json({ message: "Error inviting user", error: error.message })
  }
}

exports.trip_create_post = async (req, res) => {
  const userId = res.locals.payload.id
  console.log("Authenticated User:", userId)
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

exports.update_invite_status = async (req, res) => {
  const { inviteId } = req.params
  const { status } = req.body

  try {
    const invite = await Invite.findById(inviteId)
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" })
    }

    invite.status = status
    await invite.save()

    if (status === "accepted") {
      const trip = await Trip.findById(invite.trip)
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" })
      }

      // Add the invitee to the participants array if not already added
      if (!trip.participants.includes(invite.invitee)) {
        trip.participants.push(invite.invitee)
        await trip.save()
      }

      res
        .status(200)
        .json({ message: "Invite accepted and participant added to the trip" })
    } else if (status === "declined") {
      res.status(200).json({ message: "Invite declined" })
    } else {
      res.status(400).json({ message: "Invalid status" })
    }
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
