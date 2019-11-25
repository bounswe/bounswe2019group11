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
                code: '$code'
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$$code', '$currencyCode']
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
                        currencyCode: 0
                    }
                }
            ],
            as: 'comments'
        }
    },
    MATCH_CODE: (code) => {
        return {
            $match: {
                $expr: {
                    $eq: ['$code', code]
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
    PROJECT_MINIMAL: {
        $project: {
            code: 1,
            name: 1,
            rate: 1,
            _id: 0
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
    const currency = await Currency.aggregate([
        STAGES.MATCH_CODE(code), STAGES.PROJECT_MINIMAL, STAGES.GET_COMMENTS
    ]).then();

    return currency[0];
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
    await Prediction.updateOne(
        {userId, currencyCode: code, equipmentType: predictionHelper.EQUIPMENT_TYPE.CURRENCY},
        {snapShot: currentRate, prediction},
        {upsert: true});
};

module.exports.clearPrediction = async (code, userId) => {
    code = code.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(code)) {
        throw errors.INVALID_CURRENCY_CODE();
    }

    await Prediction.deleteOne({userId, currencyCode: code, equipmentType: predictionHelper.EQUIPMENT_TYPE.CURRENCY});
};

module.exports.postComment = async (currencyCode, authorId, body) => {
    currencyCode = currencyCode.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(currencyCode)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    await CurrencyComment.create({
        currencyCode,
        authorId,
        body,
    });
};

module.exports.getComment = async (currencyCode, commentId) => {
    currencyCode = currencyCode.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(currencyCode)) {
        throw errors.INVALID_CURRENCY_CODE();
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

module.exports.editComment = async (currencyCode, authorId, commentId, newBody) => {
    currencyCode = currencyCode.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(currencyCode)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    const oldComment = await CurrencyComment.findOneAndUpdate({_id: commentId, currencyCode, authorId},
        {body: newBody, edited: true, lastEditDate: Date.now()});
    if (!oldComment) {
        throw errors.COMMENT_NOT_FOUND();
    }
};

module.exports.deleteComment = async (currencyCode, commentId, authorId) => {
    currencyCode = currencyCode.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(currencyCode)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    const comment = await CurrencyComment.findOneAndDelete({_id: commentId, currencyCode, authorId});
    if (!comment) {
        throw errors.COMMENT_NOT_FOUND();
    }
};
