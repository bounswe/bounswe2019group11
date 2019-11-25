const Currency = require('../models/currency');
const errors = require('../helpers/errors');
const CurrencyComment = require('../models/currencyComment');
const mongoose = require('mongoose');
const Prediction = require('../models/prediction');
const predictionHelper = require('../helpers/prediction');

const STAGES = {
    GET_COMMENTS: {
        $lookup: {
            from: 'currencycomments',
            let: {
                currencyId: '$_id'
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$$currencyId', '$currencyId']
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
                        currencyId: 0
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

const SUPPORTED_CURRENCIES = new Set([
    'EUR',
    'JPY',
    'GBP',
    'CHF',
    'TRY',
]);

module.exports.getAll = async () => {
    return await Currency
        .find()
        .select('code name rate -_id')
        .exec();
};

module.exports.get = async (code) => {
    code = code.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(code)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    return await Currency
        .findOne({code})
        .select('code name rate -_id')
        .exec();
};

module.exports.getIntraday = async (code) => {
    code = code.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(code)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    return await Currency
        .findOne({code})
        .select('code name rate intradayRates -_id')
        .exec();
};

module.exports.getLastWeek = async (code) => {
    code = code.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(code)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    let currency = await Currency
        .findOne({code})
        .select('code name rate dailyRates -_id')
        .exec();
    currency = currency.toObject();
    const dailyRateKeys = Object.keys(currency.dailyRates);
    const lastWeek = {};
    const limit = Math.min(7, dailyRateKeys.length);
    for (let i = 0; i < limit; i++) {
        lastWeek[dailyRateKeys[i]] = currency.dailyRates[dailyRateKeys[i]];
    }
    currency.lastWeek = lastWeek;
    delete currency.dailyRates;
    return currency;
};

module.exports.getLastMonth = async (code) => {
    code = code.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(code)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    let currency = await Currency
        .findOne({code})
        .select('code name rate dailyRates -_id')
        .exec();
    currency = currency.toObject();
    const dailyRateKeys = Object.keys(currency.dailyRates);
    const lastMonth = {};
    const limit = Math.min(30, dailyRateKeys.length);
    for (let i = 0; i < limit; i++) {
        lastMonth[dailyRateKeys[i]] = currency.dailyRates[dailyRateKeys[i]];
    }
    currency.lastMonth = lastMonth;
    delete currency.dailyRates;
    return currency;
};

module.exports.getLast100 = async (code) => {
    code = code.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(code)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    return await Currency
        .findOne({code})
        .select('code name rate dailyRates -_id')
        .exec();
};

module.exports.getLastFull = async (code) => {
    code = code.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(code)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    return await Currency
        .findOne({code})
        .select('-__v -_id')
        .exec();
};

module.exports.predict = async (code, userId, prediction) => {
    code = code.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(code)) {
        throw errors.INVALID_CURRENCY_CODE();
    }

    let currentRate = await Currency
        .findOne({code})
        .select('rate -_id')
        .exec();
    currentRate = currentRate.rate;
    await Prediction.create({
        userId,
        currencyCode: code,
        equipmentType: predictionHelper.EQUIPMENT_TYPE.CURRENCY,
        snapshot: currentRate,
        prediction
    });
};

/*
module.exports.postComment = async (currencyId, authorId, body) => {
    if (!(mongoose.Types.ObjectId.isValid(currencyId))) {
        throw errors.CURRENCY_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    await CurrencyComment.create({
        currencyId,
        authorId,
        body,
    });
};

module.exports.getComment = async (currencyId, commentId) => {
    if (!(mongoose.Types.ObjectId.isValid(currencyId))) {
        throw errors.CURRENCY_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    const comment = await CurrencyComment.aggregate([
        STAGES.MATCH_COMMENT(commentId)
    ]).then();
    if (!comment) {
        throw errors.COMMENT_NOT_FOUND();
    }
    return comment[0];
};

module.exports.editComment = async (currencykId, authorId, commentId, newBody) => {
    if (!(mongoose.Types.ObjectId.isValid(currencyId))) {
        throw errors.CURRENCY_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    const oldComment = await CurrencyComment.findOneAndUpdate({_id: commentId, currencyId, authorId},
        {body: newBody, edited: true, lastEditDate: Date.now()});
    if (!oldComment) {
        throw errors.COMMENT_NOT_FOUND();
    }
};

module.exports.deleteComment = async (currencyId, commentId, authorId) => {
    if (!(mongoose.Types.ObjectId.isValid(currencyId))) {
        throw errors.CURRENCY_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    const comment = await CurrencyComment.findOneAndDelete({_id: commentId, currencyId, authorId});
    if (!comment) {
        throw errors.COMMENT_NOT_FOUND();
    }
};
*/
