// const moodService = require('../services/moodService.js');

// exports.createMoodEntry = async (req, res) => {
//   try {
//     const moodEntry = await moodService.createMoodEntry(req.body);
//     res.status(201).json(moodEntry);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getMoodEntries = async (req, res) => {
//   try {
//     const moodEntries = await moodService.getMoodEntries(req.params.userId);
//     res.status(200).json(moodEntries);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.updateMoodEntry = async (req, res) => {
//   try {
//     const updatedEntry = await moodService.updateMoodEntry(req.params.entryId, req.body);
//     res.status(200).json(updatedEntry);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.deleteMoodEntry = async (req, res) => {
//   try {
//     await moodService.deleteMoodEntry(req.params.entryId);
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const {
    createMoodEntry,
    getMoodEntries,
    updateMoodEntry,
    deleteMoodEntry
} = require('../services/moodService');

exports.createMoodEntry = async (req, res) => {
  try {
    const moodEntry = await createMoodEntry(req , res);
    res.status(201).json(moodEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMoodEntries = async (req, res) => {
  try {
    const moodEntries = await getMoodEntries(req, res);
    res.status(200).json(moodEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMoodEntry = async (req, res) => {
  try {
    const updatedEntry = await moodService.updateMoodEntry( req, res);
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMoodEntry = async (req, res) => {
  try {
    await moodService.deleteMoodEntry(req , res);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
