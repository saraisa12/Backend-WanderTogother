// routes/inviteRoutes.js
const express = require("express")
const router = express.Router()
const { stripToken, verifyToken } = require("../middleware/index")

const inviteCntrl = require("../controllers/invite")

router.post("/add", stripToken, verifyToken, inviteCntrl.invite_create_post)

router.get(
  "/list/:tripId",
  stripToken,
  verifyToken,
  inviteCntrl.invite_list_get
)

router.delete("/delete/:id", stripToken, verifyToken, inviteCntrl.delete_invite)
module.exports = router
