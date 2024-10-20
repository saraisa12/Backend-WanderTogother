const Trip = require("../models/Trip")
const User = require("../models/User")
const nodemailer = require("nodemailer")

exports.trip_invite_post = async (req, res) => {
  const { tripId, email } = req.body // Get trip ID and user's email from the request body
  const userId = res.locals.payload.id // Get the authenticated user's ID

  console.log("Received request to invite user:", { tripId, email, userId }) // Log input

  try {
    // Find the trip by ID
    const trip = await Trip.findById(tripId)
    if (!trip) {
      console.log("Trip not found:", tripId) // Log if trip not found
      return res.status(404).json({ message: "Trip not found" })
    }

    // Ensure that the requesting user is the creator of the trip
    if (trip.creator.toString() !== userId) {
      console.log("User not authorized to invite:", userId) // Log if not authorized
      return res.status(403).json({
        message: "You do not have permission to invite users to this trip.",
      })
    }

    // Find the user to be invited by their email
    const user = await User.findOne({ email })
    if (!user) {
      console.log("User not found:", email) // Log if user not found
      return res.status(404).json({ message: "User not found" })
    }

    // Check if the user is already invited
    if (trip.invitees.includes(user._id)) {
      console.log("User is already invited:", user._id) // Log if already invited
      return res.status(400).json({ message: "User is already invited" })
    }

    // Add the user ID to the invitees array
    trip.invitees.push(user._id)
    await trip.save()

    // Optionally, send an email invite
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You've Been Invited to a Trip!",
      text: `You've been invited to join a trip. Click here to view it: http://your-frontend-url.com/trip/${tripId}`,
    }

    console.log("Sending email to:", email) // Log email sending attempt
    console.log("Mail options:", mailOptions) // Log mail options

    await transporter.sendMail(mailOptions)
    console.log("Email sent successfully") // Log success

    res.status(200).json({ message: "User invited successfully" })
  } catch (error) {
    console.error("Error inviting user:", error) // Log error
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
    const userId = res.locals.payload.id

    const creatorId = userId // Get the user's ID
    console.log(creatorId)

    // Find all trips created by the user
    const trips = await Trip.find({ creator: creatorId })

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
    const id = req.params.id
    const trip = await Trip.findById(id)

    console.log(trip)
    res.status(200).json(trip)
  } catch (error) {
    console.error("Error retrieving trip:", error)
    res.status(500).json({ error: error.message })
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
