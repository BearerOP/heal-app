const mongoose = require('mongoose');

const mentalHealthSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  data: {
    mood: String, // e.g., "happy", "sad", "anxious"
    stress_level: Number, // e.g., scale of 1-10
    meditation_duration: Number, // in minutes
    journal_entry: String
  },
  timestamp: { type: Date, default: Date.now }
});

const MentalHealth = mongoose.model('MentalHealth', mentalHealthSchema);
module.exports = MentalHealth;
