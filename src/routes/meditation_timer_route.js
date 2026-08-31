const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
    generateMeditationTimer,
    view_MeditationTimer
} = require("../controllers/meditation_timer_controller.js");


router.get("/generateMeditationTimer",user_auth,  generateMeditationTimer);
router.get("/view_MeditationTimer",user_auth,  view_MeditationTimer);

module.exports = router;

