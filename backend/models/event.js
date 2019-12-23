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
    StartDate: {
        type: Date,
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

eventSchema.index({title: 'text', body: 'text', country: 'text'});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
