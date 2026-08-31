const {send_request,alluser, allRequest, update_Request, findUserById, allConnections} = require("../controllers/connection_controller.js")
const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

router.use(user_auth);

router.post("/",  send_request);
router.get("/",  allConnections);
router.put("/",update_Request)
router.get("/allRequest",  allRequest);
router.get("/findUser", findUserById);
// router.get("/alluser",  alluser);

module.exports = router;