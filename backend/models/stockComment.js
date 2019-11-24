const mongoose = require('mongoose');

const stockCommentSchema = new mongoose.Schema({
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Stock',
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

const StockComment = mongoose.model('StockComment', stockCommentSchema);
module.exports = StockComment;