const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },record: [{
    date: {
      type: Date,
      default: Date.now
    },
    steps: {
      type: Number,
      required: true
    },
    caloriesBurned: {
      type: Number,
      required: true
    }
  }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Step", StepSchema);