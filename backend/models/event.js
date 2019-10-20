const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    comment: {
        type: Array,
        ref: 'Comment'
    },
    StartDate: {
        type: Date,
        required: true
    },
    rank: {
        type: Number,
        enum: [1, 3],
        default: 3
    },
    country: {
        type: String
    }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
