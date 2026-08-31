const mongoose = require("mongoose");

const waterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dates: [
    {
      date: {
        type: Date,
        required: true,
      },
      waterIntake: [
        {
          time: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          title: {
            type: String,
            default: "Water",
          },
        },
      ],
      intakeTarget: {
        type: Number,
        required: true,
      },
      totalIntake: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Water", waterSchema);
