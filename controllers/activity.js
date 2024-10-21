const Activity = require('../models/Activity')

// Function to create a new activity
exports.createActivity = async (req, res) => {
  try {
    const { name, description, location } = req.body
    const photo = req.file ? req.file.path : null

    const newActivity = new Activity({
      name,
      description,
      location,
      photo
    })

    await newActivity.save()
    res
      .status(201)
      .json({ message: 'Activity added successfully!', activity: newActivity })
  } catch (error) {
    console.error('Error creating activity:', error)
    res
      .status(500)
      .json({ message: 'Error creating activity', error: error.message })
  }
}

// Function to get all activities
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()

    if (activities.length === 0) {
      return res.status(404).json({ message: 'No activities found.' })
    }

    res.status(200).json({ activities })
  } catch (error) {
    console.error('Error fetching activities:', error)
    res
      .status(500)
      .json({ message: 'Error fetching activities', error: error.message })
  }
}

// Function to get a single activity by ID
exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' })
    }

    res.status(200).json({ activity })
  } catch (error) {
    console.error('Error fetching activity:', error)
    res.status(500).json({ message: 'Failed to fetch activity' })
  }
}

// Function to update an existing activity
exports.updateActivity = async (req, res) => {
  try {
    const activityId = req.params.id
    const { name, description, location } = req.body
    const photo = req.file ? req.file.path : req.body.photo // Update to allow for existing photo

    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      {
        $set: {
          name,
          description,
          location,
          photo
        }
      },
      { new: true, runValidators: true }
    )

    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' })
    }

    res
      .status(200)
      .json({ message: 'Activity updated successfully', updatedActivity })
  } catch (error) {
    console.error('Error updating activity:', error)
    res.status(500).json({ error: error.message })
  }
}

// Function to delete an activity
exports.deleteActivity = async (req, res) => {
  try {
    const activityId = req.params.id
    const deletedActivity = await Activity.findByIdAndDelete(activityId)

    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' })
    }

    res.status(200).json({ message: 'Activity deleted successfully' })
  } catch (error) {
    console.error('Error deleting activity:', error)
    res.status(500).json({ error: error.message })
  }
}
