const Article = require('../models/article');

module.exports.getAll = async ()=>{
    return await Article.find();
};

module.exports.getByID = async (articleID) => {
    return await Article.findOne({
        _id: articleID,
    });
};

module.exports.getByUserID = async (userID) => {
    return await Article.find({
        authorID: userID,
    });
};

module.exports.create = async (article) => {
    const newArticle = {...article};
    const createdArticle = await Stock.create(newArticle);
    return createdStock;
}; 

module.exports.delete = async (articleID) => {
    return await Article.findByIdAndDelete(articleID);
}; 
