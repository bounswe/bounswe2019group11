const mongoose = require('mongoose');

const articleVoteSchema = new mongoose.Schema({
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
    value: {
        type: Number,
        required: true,
        enum: [-1, 0, 1],
    }
});

const ArticleVote = mongoose.model('ArticleVote', articleVoteSchema);
module.exports = ArticleVote;
