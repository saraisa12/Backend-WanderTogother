const express = require('express')
const router = express.Router()
const Activity = require('../models/Activity')

router.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find()
    res.json(activities)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activities' })
  }
})

router.post('/activities', async (req, res) => {
  const { name, price, location, description, mapLink } = req.body
  const newActivity = new Activity({
    name,
    price,
    location,
    description,
    mapLink
  })

  try {
    const savedActivity = await newActivity.save()
    res.json(savedActivity)
  } catch (err) {
    res.status(500).json({ error: 'Failed to save activity' })
  }
})

router.put('/activities/:id/reactions', async (req, res) => {
  const { id } = req.params
  const { reaction } = req.body

  try {
    const activity = await Activity.findById(id)
    if (!activity) return res.status(404).json({ error: 'Activity not found' })

    activity.reactions[reaction] += 1
    await activity.save()
    res.json(activity)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update reaction' })
  }
})

module.exports = router
