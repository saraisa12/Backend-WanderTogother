const express = require('express')
const { stripToken, verifyToken } = require('../middleware/index')
const router = express.Router()

router.use(express.urlencoded({ extended: true }))

// Import controller
const upload = require('../middleware/upload')
const activityCntrl = require('../controllers/activity')

// Routes
router.post(
  '/add',
  stripToken,
  verifyToken,
  upload.single('photo'),
  activityCntrl.createActivity
)

router.put(
  '/update/:id',
  stripToken,
  verifyToken,
  upload.single('photo'),
  activityCntrl.updateActivity
)

router.delete(
  '/delete/:id',
  stripToken,
  verifyToken,
  activityCntrl.deleteActivity
)

router.get('/index', stripToken, verifyToken, activityCntrl.getAllActivities)

module.exports = router
