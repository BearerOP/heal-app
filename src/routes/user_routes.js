const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
    user_register }  = require("../controllers/user_controller.js")

router.get("/",user)

// router.post("/login", user_login);

router.post("/register", user_register);

// router.post("/logout",user_auth,user_logout)

// router.post("/sendOtp",sendOtp);

// router.get("/profile",user_auth,user_profile);

module.exports = router;
