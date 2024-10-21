const express = require('express')
const { stripToken, verifyToken } = require('../middleware/index')
const router = express.Router()

const upload = require('../middleware/upload')
const activityCntrl = require('../controllers/activity')

// Route to create a new activity
router.post(
  '/add',
  stripToken,
  verifyToken,
  upload.single('photo'),
  activityCntrl.createActivity
)

// Route to update an existing activity
router.put(
  '/update/:id',
  stripToken,
  verifyToken,
  upload.single('photo'),
  activityCntrl.updateActivity
)

// Route to delete an activity
router.delete(
  '/delete/:id',
  stripToken,
  verifyToken,
  activityCntrl.deleteActivity
)

// Route to get all activities
router.get('/index', stripToken, verifyToken, activityCntrl.getAllActivities)

// Route to get a single activity by ID
router.get('/:id', stripToken, verifyToken, activityCntrl.getActivity)

module.exports = router
