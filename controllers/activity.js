const Activity = require("../models/Activity")
const mongoose = require("mongoose")

exports.createActivity = async (req, res) => {
  try {
    console.log("Received request body:", req.body) // Log the incoming request body

    const { name, description, Date, tripId, mapsUrl, photoUrl } = req.body

    const newActivity = new Activity({
      name,
      description,
      Date,
      tripId,
      mapsUrl,
      photoUrl,
    })

    await newActivity.save()
    res.status(201).json({ message: "Activity added successfully!" })
  } catch (error) {
    console.error("Error creating activity:", error)
    res
      .status(500)
      .json({ message: "Error creating activity", error: error.message })
  }
}

// Fetch all activities and populate the user field in comments
exports.getAllActivities = async (req, res) => {
  try {
    const { tripId } = req.params
    console.log({ tripId })
    const activities = await Activity.find({ tripId }).populate({
      path: "comments.user", // Populate the user field in comments
      select: "name", // Only fetch the name field
    })

    if (activities.length === 0) {
      console.log("No activities found for this trip:", tripId)
      console.log(activities.length)
      return res
        .status(404)
        .json({ message: "No activities found for this trip." })
    }

    res.status(200).json({ activities })
  } catch (error) {
    console.error("Error fetching activities:", error)
    res
      .status(500)
      .json({ message: "Error fetching activities", error: error.message })
  }
}

// Fetch a single activity and populate the user field in comments
exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate({
      path: "comments.user", // Populate the user field in comments
      select: "name", // Only fetch the name field
    })

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" })
    }

    res.status(200).json({ activity })
  } catch (error) {
    console.error("Error fetching activity:", error)
    res.status(500).json({ message: "Failed to fetch activity" })
  }
}

exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate({
      path: "comments.user", // Populate the user field in comments
      select: "name", // Only fetch the name field
    })

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" })
    }

    res.status(200).json({ activity })
  } catch (error) {
    console.error("Error fetching activity:", error)
    res.status(500).json({ message: "Failed to fetch activity" })
  }
}

exports.updateActivity = async (req, res) => {
  try {
    const activityId = req.params.id
    const { name, description, location } = req.body
    const photo = req.file ? req.file.path : req.body.photo

    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      {
        $set: {
          name,
          description,
          location,
          photo,
        },
      },
      { new: true, runValidators: true }
    )

    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" })
    }

    res
      .status(200)
      .json({ message: "Activity updated successfully", updatedActivity })
  } catch (error) {
    console.error("Error updating activity:", error)
    res.status(500).json({ error: error.message })
  }
}

exports.deleteActivity = async (req, res) => {
  try {
    const activityId = req.params.id
    const deletedActivity = await Activity.findByIdAndDelete(activityId)

    if (!deletedActivity) {
      return res.status(404).json({ message: "Activity not found" })
    }

    res.status(200).json({ message: "Activity deleted successfully" })
  } catch (error) {
    console.error("Error deleting activity:", error)
    res.status(500).json({ error: error.message })
  }
}

exports.voteActivity = async (req, res) => {
  try {
    const { voteType } = req.body

    const activity = await Activity.findById(req.params.id)

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" })
    }

    // Initialize vote counters if they don't exist
    activity.happyVotes = activity.happyVotes || 0
    activity.neutralVotes = activity.neutralVotes || 0
    activity.angryVotes = activity.angryVotes || 0

    // Handle the different vote types
    if (voteType === "happy") {
      activity.happyVotes += 1
    } else if (voteType === "neutral") {
      activity.neutralVotes += 1
    } else if (voteType === "angry") {
      activity.angryVotes += 1
    } else {
      return res.status(400).json({ message: "Invalid vote type" })
    }

    await activity.save()
    res.status(200).json({
      message: "Vote registered",
      happyVotes: activity.happyVotes,
      neutralVotes: activity.neutralVotes,
      angryVotes: activity.angryVotes,
    })
  } catch (error) {
    console.error("Error voting activity:", error)
    res
      .status(500)
      .json({ message: "Failed to register vote", error: error.message })
  }
}

exports.addComment = async (req, res) => {
  try {
    // Get the user ID from the token payload (assuming it's stored in res.locals.payload.id)
    const userId = res.locals.payload.id

    // Validate if the userId is present and is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing user ID" })
    }

    // Get the comment text from the request body
    const { text } = req.body
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" })
    }

    // Find the activity to which the comment is being added
    const activity = await Activity.findById(req.params.id)
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" })
    }

    // Create a new comment with the user ID and the comment text
    const newComment = {
      text,
      user: new mongoose.Types.ObjectId(userId), // Corrected ObjectId creation with 'new'
      createdAt: new Date(),
    }

    // Add the new comment to the activity's comments array
    activity.comments.push(newComment)

    // Save the updated activity document
    await activity.save()

    // Return a success response with the updated list of comments
    res
      .status(200)
      .json({ message: "Comment added", comments: activity.comments })
  } catch (error) {
    console.error("Error adding comment:", error)
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message })
  }
}
