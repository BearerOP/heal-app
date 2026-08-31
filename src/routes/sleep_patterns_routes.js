const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
  sleep_duration_add,
  sleep_duration_end,
  sleep_view,
  sleep_view_all,
  sleep_weekly_avg
} = require('../controllers/sleep_patterns_controller.js');

router.post("/sleep_duration/add", user_auth, sleep_duration_add);

router.post("/sleep_duration/end", user_auth, sleep_duration_end);

router.get("/sleep/view", user_auth, sleep_view);

router.get("/sleep/view/all", user_auth, sleep_view_all);

router.get("/sleep/view/weekly_avg", user_auth, sleep_weekly_avg);

module.exports = router;