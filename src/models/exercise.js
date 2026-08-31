const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    caloriesBurn: {
        type: Number,
        required: true
    },
    doneAt: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    weekDays: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model('Exercise', exerciseSchema);