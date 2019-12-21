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
    date: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

articleSchema.index({title: 'text', body: 'text'});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
