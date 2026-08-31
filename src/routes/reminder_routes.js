const express = require("express");
const reminder_router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
  create_reminder,
  delete_reminders,
  update_reminder,
  get_reminders,
} = require("../controllers/reminder_controller.js");

reminder_router.post("/create_reminder", user_auth, create_reminder);
reminder_router.post("/delete_reminders", user_auth, delete_reminders);
reminder_router.post("/update_reminder", user_auth, update_reminder);
reminder_router.get("/get_reminders", user_auth, get_reminders);

module.exports = reminder_router;