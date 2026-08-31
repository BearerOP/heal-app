const mongoose = require("mongoose");

const sleepSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  record:[{
    sleepTime: {
      type: Date,
      required: true,
    },
    wakeTime: {
      type: Date,
      default:null,
    },
    sleepQuality :{
      type: String,
      enum: ["excellent", "good", "fair", "poor","not provided"],
      default:"not provided"
    },
    duration: {
      hour:{
        type: Number,
        default: 0
      },
      minute:{
        type: Number,
        default: 0
      }
    }
  }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Sleep = mongoose.model("Sleep", sleepSchema);
module.exports = Sleep;
