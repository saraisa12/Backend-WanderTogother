const Trip = require("../models/Trip")
const User = require("../models/User")
const Invite = require("../models/Invite")
const nodemailer = require("nodemailer")

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

exports.get_user_trips = async (req, res) => {
  try {
    console.log("hiii")
    const userId = res.locals.payload.id

    const trips = await Trip.find({
      $or: [{ creator: userId }, { invitees: userId }],
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
