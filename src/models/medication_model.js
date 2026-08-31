const mongoose = require("mongoose");

/**
 * Frequency schema to define how often medication should be taken.
 */
const frequencySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "At Regular Intervals",
      "On Specific Days Of Week",
      "As Needed",
      "Daily",
      "Weekly",
      "Monthly"
    ],
  },
  interval: {
    type: Number,
    default: 1, // Interval count, e.g., every 1 day, 1 week, etc.
  },
  specificDays: {
    type: [String], // Specific days of week when medication is scheduled, e.g., ["Monday", "Wednesday"]
  },
}, { _id: false });

/**
 * Log schema to track medication intake events.
 */
const logSchema = new mongoose.Schema({
  time: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["taken", "skipped", "not taken yet"],
    default: "not taken yet",
  },
  logged: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

/**
 * Medication schema
 * Represents medications assigned to users or their relatives.
 */
const medicationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  forWhom: {
    type: String,
    required: true,
    enum: ["myself", "connection"],
  },
  relative_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.forWhom === "relative";
    },
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  record: [
    {
      medication_image: {
        type: String,
        required: false,
        default: null,
      },
      medicine_name: {
        type: String,
        required: true,
        trim: true,
      },
      forms: {
        type: String,
        required: true,
        enum: [
          "capsule",
          "tablet",
          "liquid",
          "topical",
          "cream",
          "device",
          "drops",
          "foam",
          "gel",
          "inhaler",
          "injection",
          "lotion",
          "ointment",
          "patch",
          "powder",
          "spray",
          "suppository",
        ],
      },
      strength: {
        type: String,
        required: true,
        trim: true,
      },
      unit: {
        type: String,
        enum: ["mg", "mcg", "g", "ml", "%"],
        required: true,
      },
      frequency: {
        type: frequencySchema,
        required: true,
      },
      times: [
        {
          dose: {
            type: String,
            required: frequencySchema.type === "As Needed" ? false : true,
            trim: true,
          },
          reception_time: {
            type: Date,
            required: frequencySchema.type === "As Needed" ? false : true,
            default: Date.now,
          },
        },
      ],
      start_date: {
        type: Date,
        required: true,
        default: Date.now,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      fills:{
        type: Number,
        default: 0,
      },
      logs: [logSchema],
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, {
  timestamps: true, // Adds createdAt and updatedAt fields to medication documents
});

const Medication = mongoose.model("Medication", medicationSchema);

module.exports = Medication;
