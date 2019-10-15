const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    comment:{
        type: Array,
        ref: 'Comment'
    },
    authorId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rank:{
        type: Number
    },
    voterNumber:{
        type: Number
    },
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;