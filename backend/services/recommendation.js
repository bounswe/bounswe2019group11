const User = require('../models/user');
const errors = require('../helpers/errors');
const ArticleVote = require('../models/articleVote');
const Article = require('../models/article');

module.exports.getNearbyUsers = async (userId) => {
    let location = await User
        .findOne({_id: userId})
        .select({'location.displayName': 1})
        .exec();

    if (!location) {
        throw errors.USER_NOT_FOUND();
    }
    location = location.location.displayName;

    return await User
        .find({
                $and: [
                    {_id: {$ne: userId}},
                    {'location.displayName': location}
                ]
            }
        )
        .select({name: 1, surname: 1})
        .exec();
};

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


module.exports.getRecommendedArticles = async (userId) => {
    const response = {
        because: null,
        articles: [],
    };

    const upvotedArticles = await ArticleVote
        .find({userId, value: 1});
    if (upvotedArticles.length === 0) {
        return response;
    }
    const selectedArticleVote = upvotedArticles[randomInt(0, upvotedArticles.length - 1)];
    const selectCondition = {tags: 1, title: 1, body: 1, imgUri: 1};
    const article = await Article
        .findOne({_id: selectedArticleVote.articleId})
        .select(selectCondition)
        .exec();
    if (!article || !article.tags) {
        return response;
    }
    const addedArticles = new Set();
    const recommendedArticles = [];
    for (let i = 0; i < article.tags.length; i++) {
        const articles = await Article
            .find({
                $and:
                    [
                        {_id: {$ne: article._id}},
                        {tags: article.tags[i]},
                    ]
            })
            .select(selectCondition)
            .exec();
        for (let j = 0; j < articles.length; j++) {
            const id = articles[j]._id;
            if (!addedArticles.has(id)) {
                addedArticles.add(id);
                recommendedArticles.push(articles[j]);
            }
        }
    }
    response.because = article;
    response.articles = recommendedArticles;
    return response;
};
