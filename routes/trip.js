const express = require("express")
const { stripToken, verifyToken } = require("../middleware/index")
const router = express.Router()

router.use(express.urlencoded({ extended: true }))

// Import controller
const upload = require("../middleware/upload")
const tripCntrl = require("../controllers/trip")

// Routes
router.post(
  "/add",
  stripToken,
  verifyToken,

  upload.single("image"),
  tripCntrl.trip_create_post
)

router.delete(
  "/delete/:id",
  stripToken,
  verifyToken,
  tripCntrl.trip_delete_delete
)

router.get("/index", stripToken, verifyToken, tripCntrl.get_user_trips)

router.get("/details/:id", stripToken, verifyToken, tripCntrl.trip_details_get)

router.post("/invite", stripToken, verifyToken, tripCntrl.trip_invite_post)

module.exports = router
