const mongoose = require("mongoose");

const moodEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  mood: {
    type: String,
    enum: ["Happy", "Sad", "Angry", "Anxious", "Calm", "Stressed", "Neutral"],
    required: true,
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  feeling: {
    type: String,
    enum:["scared", "overwhelmed",
"sad", "lonely", "empty", "hopeless",
"happy", "excited", "grateful", "proud",
"calm", "relaxed", "content", "peaceful",
"stressed", "frustrated", "irritated", "annoyed",
"neutral", "bored", "indifferent", "numb",
"worried", "confused", "lost", "unsure",    ],
    required: true,
  },
  impact: {
    type: String,
    enum:["health", "work", "relationships", "personal_growth",
"family", "social_life", "finances", "hobbies",
"school", "spirituality", "none"

    ],
  
  },

});

const mentalHealthMoodTrackerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moodEntries: [moodEntrySchema],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const MentalHealthMoodTracker = mongoose.model("MentalHealthMoodTracker", mentalHealthMoodTrackerSchema);
module.exports = MentalHealthMoodTracker;
