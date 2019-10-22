const Article = require('../models/article');
const mongoose = require('mongoose');
const errors = require('../helpers/errors');

module.exports.getAll = async () => {
    return await Article.find();
};

module.exports.getById = async (_id) => {
    if (!(mongoose.Types.ObjectId.isValid(_id))) {
        throw errors.ARTICLE_NOT_FOUND();
    }
    const article = await Article.findOne({_id});
    if (!article) {
        throw errors.ARTICLE_NOT_FOUND();
    }
    return article;
};

module.exports.getByUserId = async (_userId) => {
    if (!(mongoose.Types.ObjectId.isValid(_userId))) {
        throw errors.USER_NOT_FOUND();
    }
    return await Article.find({
        authorID: _userId
    });
};

module.exports.create = async (title, body, authorId) => {
    return await Article.create({
        title,
        body,
        authorId,
    });
};

module.exports.delete = async (articleID) => {
    return await Article.findByIdAndDelete(articleID);
}; 
