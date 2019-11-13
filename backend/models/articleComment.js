const mongoose = require('mongoose');

const articleCommentSchema = new mongoose.Schema({
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Article',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    body: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

const ArticleComment = mongoose.model('ArticleComment', articleCommentSchema);
module.exports = ArticleComment;
