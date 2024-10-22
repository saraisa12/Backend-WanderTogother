const Note = require('../models/Note')

const createNote = async (req, res) => {
  const { content, tripId } = req.body

  if (!content || !tripId) {
    return res.status(400).json({ message: 'Content and tripId are required' })
  }

  try {
    const newNote = new Note({
      content,
      tripId
    })
    await newNote.save()
    return res.status(201).json(newNote)
  } catch (error) {
    console.error('Error creating note:', error)
    return res.status(500).json({ message: 'Failed to create note', error })
  }
}

const getNotesByTrip = async (req, res) => {
  const { tripId } = req.params

  try {
    const notes = await Note.find({ tripId })
    return res.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return res.status(500).json({ message: 'Failed to fetch notes', error })
  }
}

const deleteNote = async (req, res) => {
  const { id } = req.params

  try {
    const note = await Note.findByIdAndDelete(id)
    if (!note) {
      return res.status(404).json({ message: 'Note not found' })
    }
    return res.status(204).send()
  } catch (error) {
    console.error('Error deleting note:', error)
    return res.status(500).json({ message: 'Failed to delete note', error })
  }
}

module.exports = { createNote, getNotesByTrip, deleteNote }
