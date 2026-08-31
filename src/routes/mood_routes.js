const express = require('express');
const router = express.Router();
const {
    deleteMoodEntry,
    createMoodEntry,
    getMoodEntries,
    updateMoodEntry

}= require('../controllers/moodController');

const user_auth = require('../../middleware/user_auth');
// Define routes with simple names
router.post('/entry',user_auth, createMoodEntry);
router.get('/entries',user_auth,getMoodEntries);
router.post('/update',user_auth,updateMoodEntry);
router.post('/delete',user_auth,deleteMoodEntry);

module.exports = router;
