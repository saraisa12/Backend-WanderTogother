const express = require("express")
const router = express.Router()

const checklistCntrl = require("../controllers/checklist")

// GET all checklist items
router.get("/list/:tripId", checklistCntrl.getAllChecklists)

// POST a new checklist item
router.post("/add", checklistCntrl.createChecklist)

// PUT (update) a checklist item
router.put("/update/:id", checklistCntrl.updateChecklist)

// DELETE a checklist item
router.delete("/delete/:id", checklistCntrl.deleteChecklist)

module.exports = router
