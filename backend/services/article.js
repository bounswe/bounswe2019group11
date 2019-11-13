const Article = require('../models/article');
const mongoose = require('mongoose');
const errors = require('../helpers/errors');
const ArticleComment = require('../models/articleComment');


const STAGES = {
    GET_AUTHOR: {
        $lookup: {
            from: 'users',
            let: {
                authorId: '$authorId'
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$$authorId', '$_id']
                        }
                    }
                },
                {
                    $project: {
                        name: 1,
                        surname: 1,
                        _id: 0,
                    }
                }
            ],
            as: 'author',
        },
    },
    UNWIND_AUTHOR: {
        $unwind: "$author"
    },
    GET_COMMENTS: {
        $lookup: {
            from: 'articlecomments',
            let: {
                articleId: '$_id'
            },
            pipeline: [
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            userId: '$userId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$$userId', '$_id']
                                    }
                                }
                            },
                            {
                                $project: {
                                    name: 1,
                                    surname: 1,
                                    _id: 0,
                                }
                            }
                        ],
                        as: 'user'
                    }
                },
                {
                    $project: {
                        articleId: 0
                    }
                }
            ],
            as: 'comments'
        }
    },
    MATCH_ID: (id) => {
        return {
            $match: {
                $expr: {
                    $eq: ['$_id', {
                        $toObjectId: id,
                    }]
                }
            }
        }
    },
    MATCH_USER_ID: (id) => {
        return {
            $match: {
                $expr: {
                    $eq: ['$authorId', {
                        $toObjectId: id
                    }]
                }
            }
        }
    }
};

module.exports.getAll = async () => {
    return await Article.aggregate([
        STAGES.GET_AUTHOR, STAGES.UNWIND_AUTHOR, STAGES.GET_COMMENTS
    ]).then();
};

module.exports.getById = async (_id) => {
    if (!(mongoose.Types.ObjectId.isValid(_id))) {
        throw errors.ARTICLE_NOT_FOUND();
    }
    const article = await Article.aggregate([
        STAGES.MATCH_ID(_id), STAGES.GET_AUTHOR, STAGES.UNWIND_AUTHOR, STAGES.GET_COMMENTS
    ]).then();
    if (!article) {
        throw errors.ARTICLE_NOT_FOUND();
    }
    return article;
};

module.exports.getByUserId = async (_userId) => {
    if (!(mongoose.Types.ObjectId.isValid(_userId))) {
        throw errors.USER_NOT_FOUND();
    }
    return await Article.aggregate([
        STAGES.MATCH_USER_ID(_userId), STAGES.GET_AUTHOR, STAGES.UNWIND_AUTHOR, STAGES.GET_COMMENTS
    ]).then();
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

module.exports.postComment = async (articleId, userId, body) => {
    if (!(mongoose.Types.ObjectId.isValid(articleId))) {
        throw errors.ARTICLE_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(userId))) {
        throw errors.USER_NOT_FOUND();
    }
    await ArticleComment.create({
        articleId,
        userId,
        body,
    });
};
