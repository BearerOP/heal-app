const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reminder_info: [
    {
      type: {
        type: String,
        required: true,
        enum: ["sleep", "medication", "mental_health", "physical", "meal"],
      },
      title: {
        type: String,
        required: true,
      },
      message: {
        type: String,
      },
      format:{
        type: String,
        default:"short"
      },
      time: { 
        type: Date, 
        required: true 
      },
      repeat: { 
        type: String,
        default:'daily',
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Reminder = mongoose.model("Reminder", reminderSchema);
module.exports = Reminder;
