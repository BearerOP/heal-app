const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth");

const {
  getAllRelatives,
  getRelativeMedication,
} = require("../controllers/relatives_controller.js");

router.get("/my_connections", user_auth, getAllRelatives);

router.get("/medication", user_auth, getRelativeMedication);

module.exports = router;
