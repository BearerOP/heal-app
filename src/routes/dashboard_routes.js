const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
    get_dashboard_data
} = require("../controllers/dashboard_controller.js");

router.use(user_auth);

router.get("/", get_dashboard_data); // Get dashboard data

module.exports = router;
