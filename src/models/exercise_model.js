const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exerciseId: {
        type: String,
        required: true
    },
    target:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    caloriesBurn: {
        type: Number,
        required: true
    },
    doneAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: Boolean,
        required: true,
        default: false
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