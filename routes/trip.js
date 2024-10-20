const express = require("express")
const { stripToken, verifyToken } = require("../middleware/index")
const router = express.Router()

router.use(express.urlencoded({ extended: true }))

// Import controller
const upload = require("../middleware/upload")
const tripCntrl = require("../controllers/Trip")

// Routes
router.post(
  "/add",
  stripToken,
  verifyToken,
  upload.single("image"),
  tripCntrl.trip_create_post
)

router.delete("/delete/:id", tripCntrl.trip_delete_delete)

router.get("/index", stripToken, verifyToken, tripCntrl.get_user_trips)

router.get("/details/:id", tripCntrl.trip_details_get)

/*
// Root route (to avoid 404 for root)
router.get('/', (req, res) => {
  res.send('Welcome to the Event API')
})
*/
module.exports = router
