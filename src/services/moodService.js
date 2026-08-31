const MentalHealthMoodTracker = require('../models/mood_tracker_model.js');

exports.createMoodEntry = async (data) => {
  const moodEntry = new MentalHealthMoodTracker(data);
  return await moodEntry.save();
};

exports.getMoodEntries = async (userId) => {
  return await MentalHealthMoodTracker.find({ user_id: userId });
};

exports.updateMoodEntry = async (entryId, data) => {
  return await MentalHealthMoodTracker.findOneAndUpdate(
    { 'moodEntries._id': entryId },
    { $set: { 'moodEntries.$': data } },
    { new: true }
  );
};

exports.deleteMoodEntry = async (entryId) => {
  return await MentalHealthMoodTracker.updateOne(
    {},
    { $pull: { moodEntries: { _id: entryId } } }
  );
};
// const MentalHealthMoodTracker = require('../models/mood_tracker_model');

// exports.createMoodEntry = async (req , res) => {
  
  
// };

// exports.getMoodEntries = async (req , res) => {
// //   return await MentalHealthMoodTracker.find();
// };

// exports.updateMoodEntry = async (req , res) => {
// //   const { entryId, moodEntry } = data;
// //   return await MentalHealthMoodTracker.findOneAndUpdate(
// //     { 'moodEntries._id': entryId },
// //     { $set: { 'moodEntries.$': moodEntry } },
// //     { new: true }
// //   );
// };

// exports.deleteMoodEntry = async (req , res) => {
 
// };
