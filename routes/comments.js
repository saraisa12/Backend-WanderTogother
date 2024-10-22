const express = require('express')
const router = express.Router()
const Comment = require('../models/Comment')

router.get('/:activityId', async (req, res) => {
  try {
    const comments = await Comment.find({ activityId: req.params.activityId })
    res.status(200).json({ comments })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' })
  }
})

router.post('/:activityId', async (req, res) => {
  const { text } = req.body
  const newComment = new Comment({
    activityId: req.params.activityId,
    text
  })

  try {
    const savedComment = await newComment.save()
    res.status(201).json(savedComment)
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' })
  }
})

module.exports = router
