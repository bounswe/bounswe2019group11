const mongoose = require('mongoose');

const eventCommentSchema = new mongoose.Schema({
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    body: {
        type: String,
        required: 'InvalidBody',
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    edited: {
        type: Boolean,
        required: true,
        default: false
    },
    lastEditDate: {
        type: Date,
        required: false,
        default: null
    }
});

const EventComment = mongoose.model('EventComment', eventCommentSchema);
module.exports = EventComment;