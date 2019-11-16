const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'InvalidTitle',
    },
    body: {
        type: String,
        required: 'InvalidBody',
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    voteCount: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
