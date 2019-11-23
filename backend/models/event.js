const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'InvalidTitle',
    },
    body: {
        type: String,
        required: 'InvalidBody',
    },
    StartDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    rank: {
        type: Number,
        enum: [1, 2, 3],
        default: 3
    },
    country: {
        type: String
    }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
