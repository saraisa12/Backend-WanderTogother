const Activity = require('../models/Activity')

exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
    res.status(200).json(activities)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createActivity = async (req, res) => {
  const newActivity = new Activity(req.body)
  try {
    const savedActivity = await newActivity.save()
    res.status(201).json(savedActivity)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.updateActivity = async (req, res) => {
  try {
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' })
    }

    res.status(200).json(updatedActivity)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.deleteActivity = async (req, res) => {
  try {
    const deletedActivity = await Activity.findByIdAndDelete(req.params.id)

    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' })
    }

    res.status(200).json({ message: 'Activity deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
