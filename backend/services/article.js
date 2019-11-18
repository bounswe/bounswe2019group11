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
                  $match: {
                      $expr: {
                          $eq: ['$$articleId', '$articleId']
                      }
                  }
                },
                {
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
                        as: 'author'
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
    },
    MATCH_COMMENT: (id) => {
        return {
            $match: {
                $expr: {
                    $eq: ['$_id', {
                        $toObjectId: id,
                    }]
                }
            }
        }
    }
};

module.exports.getAll = async () => {
    return await Article.aggregate([
        STAGES.GET_AUTHOR, STAGES.UNWIND_AUTHOR
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
    return article[0];
};

module.exports.getByUserId = async (_userId) => {
    if (!(mongoose.Types.ObjectId.isValid(_userId))) {
        throw errors.USER_NOT_FOUND();
    }
    return await Article.aggregate([
        STAGES.MATCH_USER_ID(_userId), STAGES.GET_AUTHOR, STAGES.UNWIND_AUTHOR
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
    return await Article.findByIdAndDelete(articleID).exec();
};

module.exports.postComment = async (articleId, authorId, body) => {
    if (!(mongoose.Types.ObjectId.isValid(articleId))) {
        throw errors.ARTICLE_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    await ArticleComment.create({
        articleId,
        authorId,
        body,
    });
};

module.exports.getComment = async (articleId, commentId) => {
    if (!(mongoose.Types.ObjectId.isValid(articleId))) {
        throw errors.ARTICLE_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    const comment = await ArticleComment.aggregate([
        STAGES.MATCH_COMMENT(commentId), STAGES.GET_AUTHOR, STAGES.UNWIND_AUTHOR
    ]).then();
    if (!comment) {
        throw errors.COMMENT_NOT_FOUND();
    }
    return comment[0];
};

module.exports.editComment = async (articleId, commentId, newBody) => {
    if (!(mongoose.Types.ObjectId.isValid(articleId))) {
        throw errors.ARTICLE_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    const oldComment = await ArticleComment.findOneAndUpdate({_id: commentId},
        {body: newBody, edited: true, lastEditDate: Date.now()});
    if (!oldComment) {
        throw errors.COMMENT_NOT_FOUND();
    }
};

module.exports.deleteComment = async (articleId, commentId, authorId) => {
    if (!(mongoose.Types.ObjectId.isValid(articleId))) {
        throw errors.ARTICLE_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    const comment = await ArticleComment.findOneAndDelete({_id: commentId, articleId, authorId});
    if (!comment) {
        throw errors.COMMENT_NOT_FOUND();
    }
};
