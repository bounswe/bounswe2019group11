const mongoose = require('mongoose');

const currencyCommentSchema = new mongoose.Schema({
    currencyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Currency',
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

const CurrencyComment = mongoose.model('CurrencyComment', currencyCommentSchema);
module.exports = CurrencyComment;