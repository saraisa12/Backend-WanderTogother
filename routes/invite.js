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

router.put(
  "/update/:inviteId",
  stripToken,
  verifyToken,
  inviteCntrl.invite_update_put
)

router.get(
  "/details/:inviteId",
  stripToken,
  verifyToken,
  inviteCntrl.invite_details_get
)
module.exports = router
