const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  goal_details: [
    {
      title: { 
        type: String, 
        require: true 
      },
      type: { 
        type: String, 
        required: true 
      },
      description: {
        type: String,
      },
      target_value: {
        type: Number,
      },
      current_value: {
        type: Number,
      },
      unit: {
        type: String,
        enum: ["steps", "calories", "hours", "doses"],
      },
      deadline: {
        type: Date,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Goal = mongoose.model("Goal", goalSchema);
module.exports = Goal;
