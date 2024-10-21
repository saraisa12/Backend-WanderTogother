const express = require("express")
const { stripToken, verifyToken } = require("../middleware/index")
const router = express.Router()

router.use(express.urlencoded({ extended: true }))

// Import controller
const upload = require("../middleware/upload")
const inviteCntrl = require("../controllers/invite")

router.post("/add", stripToken, verifyToken, inviteCntrl.trip_invite_post)

router.delete(
  "/delete/:inviteId",
  stripToken,
  verifyToken,
  inviteCntrl.delete_invite
)

router.put(
  "/update/:inviteId",
  stripToken,
  verifyToken,
  inviteCntrl.update_invite_status
)

router.get("/list/:tripId", stripToken, verifyToken, inviteCntrl.get_invites)

module.exports = router
