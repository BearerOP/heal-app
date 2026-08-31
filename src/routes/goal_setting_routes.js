const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
  user_goal_added,
  user_goal_update,
  user_goal_delete,
  view_user_goal
} = require("../controllers/goal_setting_controller.js");

router.post("/user_goal_added", user_auth, user_goal_added);
router.post("/user_goal_update", user_auth, user_goal_update);
router.post("/user_goal_delete", user_auth, user_goal_delete);
router.get("/view_user_goal", user_auth, view_user_goal);

module.exports = router;
