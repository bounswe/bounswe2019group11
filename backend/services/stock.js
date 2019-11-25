const request = require('request-promise');
const Stock = require('../models/stock');
const errors = require('../helpers/errors');
const StockComment = require('../models/stockComment');
const mongoose = require('mongoose');
const apiUrl = process.env.ALPHAVANTAGE_URL;
const apiKeys = process.env.ALPHAVANTAGE_API_KEY;
const apiKeyArr = apiKeys.split(',');
const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};
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

const getDailyPrice = async (symbol) => {
    const rand = getRandomInt(apiKeyArr.length);
    const apiKey = apiKeyArr[rand];
    console.log(apiKey + " daily");
    const dailyParams = {function: "TIME_SERIES_INTRADAY", symbol: symbol, interval: "5min", apikey: apiKey};
    const options = {
        uri: apiUrl,
        qs: dailyParams
    };
    let response = await request.get(options);
    response = JSON.parse(response);
    if (response['Meta Data']) {
        return response['Time Series (5min)'];
    } else {
        console.log("Error in daily Data")
    }

};


const getMonthlyPrice = async (symbol) => {
    const rand = getRandomInt(apiKeyArr.length);
    const apiKey = apiKeyArr[rand];
    console.log(apiKey + " monthly");
    const dailyParams = {function: "TIME_SERIES_DAILY", symbol: symbol, apikey: apiKey};
    const options = {
        uri: apiUrl,
        qs: dailyParams
    };
    let response = await request.get(options);
    response = JSON.parse(response);
    if (response['Meta Data']) {
        return response['Time Series (Daily)'];
    } else {
        console.log("Error in Montly Data")
    }

};


module.exports.getAll = async () => {
    return await Stock.find();
};

module.exports.getById = async (_id) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw errors.STOCK_NOT_FOUND();
    }
    const stock = await Stock.aggregate([
        STAGES.MATCH_ID(_id), STAGES.GET_COMMENTS
    ]).then();
    if (!stock) {
        throw errors.STOCK_NOT_FOUND();
    }
    // Parallel API calls
    const promises = [getDailyPrice(stock.stockSymbol), getMonthlyPrice(stock.stockSymbol)];
    const resolves = await Promise.all(promises);
    stock['dailyPrice'] = resolves[0];
    stock['monthlyPrice'] = resolves[1];
    return stock;
};

module.exports.create = async (theStock) => {
    const stock = {...theStock};
    const createdStock = await Stock.create(stock);
    return createdStock;
};
module.exports.delete = async (_id) => {
    return await Stock.deleteOne({_id});
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