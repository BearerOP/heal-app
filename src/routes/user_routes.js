const express = require("express");
const router = express.Router();
const multer = require("multer");

const user_auth = require("../../middleware/user_auth.js");

const storageMulter = multer.memoryStorage();
const upload = multer({ storage: storageMulter });

const {
  user_login,
  user_register,
  user_logout,
  sendOtp,
  user_profile,
  allUsers,
  profile_update,
  profile_picture,
  verifyOtp,
  update_Password
} = require("../controllers/user_controller.js");

router.post("/login", user_login);

router.post("/register", user_register);

router.get("/logout", user_auth, user_logout);

router.post("/sendOtp", sendOtp);

router.post("/verifyOtp", verifyOtp);

router.use(user_auth);

router.post("/updatePassword", update_Password);

router.get("/", user_profile);

router.get("/allUsers", allUsers);

router.put("/", profile_update);

router.post("/profile/picture", upload.single("file"), profile_picture);

module.exports = router;
