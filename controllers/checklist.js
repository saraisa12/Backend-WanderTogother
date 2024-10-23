const Checklist = require("../models/checklist")

exports.getAllChecklists = async (req, res) => {
  const { tripId } = req.params
  try {
    const checklist = await Checklist.find({ trip: tripId })
    res.json({ success: true, data: checklist })
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" })
  }
}

exports.createChecklist = async (req, res) => {
  const { title, tripId } = req.body

  try {
    const newTask = new Checklist({ title, trip: tripId })
    const savedTask = await newTask.save()
    res.json({ success: true, data: savedTask })
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid Input" })
  }
}

// PUT (update) a checklist item
exports.updateChecklist = async (req, res) => {
  const { id } = req.params
  const { title, completed } = req.body

  try {
    const updatedTask = await Checklist.findByIdAndUpdate(
      id,
      { title, completed, updatedAt: Date.now() },
      { new: true }
    )
    res.json({ success: true, data: updatedTask })
  } catch (error) {
    res.status(400).json({ success: false, error: "Update Failed" })
  }
}

// DELETE a checklist item
exports.deleteChecklist = async (req, res) => {
  const { id } = req.params

  try {
    await Checklist.findByIdAndDelete(id)
    res.json({ success: true, message: "Task Deleted" })
  } catch (error) {
    res.status(400).json({ success: false, error: "Delete Failed" })
  }
}
