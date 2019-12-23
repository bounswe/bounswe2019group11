const Stock = require('../models/stock');
const errors = require('../helpers/errors');
const StockComment = require('../models/stockComment');
const mongoose = require('mongoose');
const Alert = require('../models/alert');
const alertHelper = require('../helpers/alert');

const STAGES = {
    GET_COMMENTS: {
        $lookup: {
            from: 'stockcomments',
            let: {
                stockId: '$_id'
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$$stockId', '$stockId']
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
                        stockId: 0
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
    },

};

module.exports.getAll = async () => {
    return await Stock
        .find()
        .select("-monthlyPrice -dailyPrice")
        .exec();
};

module.exports.getById = async (_id) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw errors.STOCK_NOT_FOUND();
    }
    const stock = await Stock.aggregate([
        STAGES.MATCH_ID(_id), STAGES.GET_COMMENTS
    ]);

    return stock[0];
};

module.exports.postComment = async (stockId, authorId, body) => {
    if (!(mongoose.Types.ObjectId.isValid(stockId))) {
        throw errors.STOCK_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    await StockComment.create({
        stockId,
        authorId,
        body,
    });
};

module.exports.getComment = async (stockId, commentId) => {
    if (!(mongoose.Types.ObjectId.isValid(stockId))) {
        throw errors.STOCK_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    const comment = await StockComment.aggregate([
        STAGES.MATCH_COMMENT(commentId)
    ]).then();
    if (!comment) {
        throw errors.COMMENT_NOT_FOUND();
    }
    return comment[0];
};

module.exports.editComment = async (stockId, authorId, commentId, newBody) => {
    if (!(mongoose.Types.ObjectId.isValid(stockId))) {
        throw errors.STOCK_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    const oldComment = await StockComment.findOneAndUpdate({_id: commentId, stockId: stockId, authorId},
        {body: newBody, edited: true, lastEditDate: Date.now()});
    if (!oldComment) {
        throw errors.COMMENT_NOT_FOUND();
    }
};

module.exports.deleteComment = async (stockId, commentId, authorId) => {
    if (!(mongoose.Types.ObjectId.isValid(stockId))) {
        throw errors.STOCK_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    const comment = await StockComment.findOneAndDelete({_id: commentId, stockId, authorId});
    if (!comment) {
        throw errors.COMMENT_NOT_FOUND();
    }
};

module.exports.saveAlert = async (id, userId, direction, rate) => {
    if (!(mongoose.Types.ObjectId.isValid(id))) {
        throw errors.STOCK_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(userId))) {
        throw errors.USER_NOT_FOUND();
    }
    const stockSymbol = await Stock
        .findOne({_id: id})
        .select({stockSymbol: 1})
        .exec();
    await Alert.create({
        type: alertHelper.TYPE.STOCK,
        userId,
        direction,
        rate,
        stockId: id,
        stockSymbol: stockSymbol.stockSymbol,
    });
};

module.exports.deleteAlert = async (stockId, userId, alertId) => {
    if (!(mongoose.Types.ObjectId.isValid(stockId))) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    if (!(mongoose.Types.ObjectId.isValid(userId))) {
        throw errors.USER_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(alertId))) {
        throw errors.ALERT_NOT_FOUND();
    }
    const alert = await Alert.findOneAndDelete({_id: alertId, type: alertHelper.TYPE.STOCK, stockId, userId});
    if (!alert) {
        throw errors.ALERT_NOT_FOUND();
    }
};
