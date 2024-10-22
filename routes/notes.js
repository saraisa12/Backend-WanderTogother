const express = require('express')
const {
  createNote,
  getNotesByTrip,
  deleteNote
} = require('../controllers/noteController')
const router = express.Router()

router.post('/', createNote)

router.get('/:tripId', getNotesByTrip)

router.delete('/:id', deleteNote)

module.exports = router
