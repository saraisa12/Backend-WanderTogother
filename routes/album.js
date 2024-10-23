const express = require("express")
const router = express.Router()
const upload = require("../middleware/upload")
const albumCntrl = require("../controllers/album")

router.post("/add/:tripId", upload.array("images", 10), albumCntrl.addImages)

// Get the shared album for a specific trip
router.get("/:tripId", albumCntrl.getAlbum)

module.exports = router
