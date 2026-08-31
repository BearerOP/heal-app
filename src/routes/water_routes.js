const express = require("express");
const router = express.Router();

const {
    getWaterController,
    updateWaterController,
} = require('../controllers/water_controller.js')

const user_auth = require("../../middleware/user_auth.js");
router.use(user_auth);
router.get("/", getWaterController);
router.put("/", updateWaterController);

module.exports = router;