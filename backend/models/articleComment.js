const mongoose = require('mongoose');

const articleCommentSchema = new mongoose.Schema({
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Article',
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

const ArticleComment = mongoose.model('ArticleComment', articleCommentSchema);
module.exports = ArticleComment;
