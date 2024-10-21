const express = require('express')
const { stripToken, verifyToken } = require('../middleware/index')
const router = express.Router()

const upload = require('../middleware/upload')
const activityCntrl = require('../controllers/activity')

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

router.get('/:id', stripToken, verifyToken, activityCntrl.getActivity)

module.exports = router
