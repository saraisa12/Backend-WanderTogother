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
      inviteeEmail: invitee.email,
      status: "pending", // You can set this based on your requirements
    })

    await newInvite.save()

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const inviteLink = `http://localhost:5173/invite/accept/${newInvite._id}`
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You've Been Invited to a Trip!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 10px 0;
            }
            .header img {
              width: 120px;
            }
            .content {
              padding: 20px;
              text-align: center;
            }
            .button {
              background-color: #28a745;
              color: #ffffff;
              text-decoration: none;
              padding: 15px 20px;
              border-radius: 5px;
              display: inline-block;
              margin-top: 20px;
            }
            .footer {
              margin-top: 20px;
              padding: 10px;
              text-align: center;
              font-size: 12px;
              color: #777777;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <img src="https://yourdomain.com/logo.png" alt="Logo">
            </div>
            <div class="content">
              <h1>You're Invited to a Trip!</h1>
              <p>
                Your friend has invited you to join an upcoming trip. Click the button below to see the trip details and join in on the adventure.
              </p>
              <a href="${inviteLink}" class="button">Join the Trip</a>
            </div>
            <div class="footer">
              <p>
                If you have any questions, please contact us at <a href="mailto:support@yourdomain.com">support@yourdomain.com</a>.
              </p>
              <p>&copy; 2024 Wander Together. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
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

exports.invite_details_get = async (req, res) => {
  const { inviteId } = req.params

  try {
    const invite = await Invite.findById(inviteId).populate("trip invitee")

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" })
    }

    res.status(200).json(invite)
  } catch (error) {
    console.error("Error fetching invite details:", error)
    res
      .status(500)
      .json({ message: "Error fetching invite details", error: error.message })
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

exports.invite_update_put = async (req, res) => {
  const { status } = req.body
  const { inviteId } = req.params
  const userId = res.locals.payload.id // Get the user ID from the token

  try {
    const invite = await Invite.findById(inviteId).populate("trip")

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" })
    }

    // Update the invite status
    invite.status = status
    await invite.save()

    // If the status is accepted, add the user to the participants array
    if (status === "accepted") {
      const trip = invite.trip
      if (!trip.participants.includes(userId)) {
        trip.participants.push(userId)
        await trip.save() // Save the updated trip
      }
    }

    res.status(200).json({ message: "Invite status updated", invite })
  } catch (error) {
    console.error("Error updating invite status:", error)
    res
      .status(500)
      .json({ message: "Error updating invite status", error: error.message })
  }
}
