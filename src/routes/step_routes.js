const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const { 
    add_step,
    view_step_daily,
    view_step_weekly,
    view_step_monthly
} = require("../controllers/step_controller.js");

router.post("/add", user_auth, add_step);

router.get("/view/daily", user_auth, view_step_daily);

router.get("/view/weekly", user_auth, view_step_weekly);

router.get("/view/monthly", user_auth, view_step_monthly);

module.exports = router