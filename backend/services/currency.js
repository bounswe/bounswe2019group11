const Currency = require('../models/currency');
const errors = require('../helpers/errors');
const CurrencyComment = require('../models/currencyComment');
const mongoose = require('mongoose');
const Prediction = require('../models/prediction');
const predictionHelper = require('../helpers/prediction');
const Alert = require('../models/alert');
const alertHelper = require('../helpers/alert');

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
        }
    },
    GET_PREDICTIONS: {
        $lookup: {
            from: 'predictions',
            let: {
                code: '$code'
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ['$$code', '$currencyCode']
                                },
                                {
                                    $eq: [predictionHelper.EQUIPMENT_TYPE.CURRENCY, '$equipmentType']
                                }
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: '$prediction',
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $addFields: {
                        'prediction': '$_id'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ],
            as: 'predictions'
        }
    },
    GET_USER_PREDICTION: (userId) => {
        return {
            $lookup: {
                from: 'predictions',
                let: {
                    code: '$code',
                    userId: userId,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$$code', '$currencyCode']
                                    },
                                    {
                                        $eq: [predictionHelper.EQUIPMENT_TYPE.CURRENCY, '$equipmentType']
                                    },
                                    {
                                        $eq: ['$userId', { $toObjectId: '$$userId' }]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            prediction: 1,
                            _id: 0,
                        }
                    }
                ],
                as: 'userPrediction'
            }
        }
    },
    UNWIND_USER_PREDICTION: {
        $unwind: {
            path: '$userPrediction',
            preserveNullAndEmptyArrays: true,
        }
    },
    SET_USER_PREDICTION: {
        $addFields: {
            userPrediction: {
                $ifNull: ["$userPrediction.prediction", 0]
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
        .select('code name rate')
        .exec();
};

module.exports.get = async (code, userId) => {
    code = code.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(code)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    const currency = await Currency.aggregate([
        STAGES.MATCH_CODE(code), STAGES.PROJECT_MINIMAL, STAGES.GET_COMMENTS, STAGES.GET_PREDICTIONS,
        STAGES.GET_USER_PREDICTION(userId), STAGES.UNWIND_USER_PREDICTION, STAGES.SET_USER_PREDICTION
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
        .select('code name rate intradayRates')
        .exec();
};

module.exports.getLastWeek = async (code) => {
    code = code.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(code)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    let currency = await Currency
        .findOne({code})
        .select('code name rate dailyRates')
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
        .select('code name rate dailyRates')
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
        .select('code name rate dailyRates')
        .exec();
};

module.exports.getLastFull = async (code) => {
    code = code.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(code)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    return await Currency
        .findOne({code})
        .select('-__v')
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
        {snapshot: currentRate, prediction},
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

module.exports.saveAlert = async (currencyCode, userId, direction, rate) => {
    currencyCode = currencyCode.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(currencyCode)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    if (!(mongoose.Types.ObjectId.isValid(userId))) {
        throw errors.USER_NOT_FOUND();
    }
    await Alert.create({
        type: alertHelper.TYPE.CURRENCY,
        userId,
        direction,
        rate,
        currencyCode
    });
};

module.exports.deleteAlert = async (currencyCode, userId, alertId) => {
    currencyCode = currencyCode.toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(currencyCode)) {
        throw errors.INVALID_CURRENCY_CODE();
    }
    if (!(mongoose.Types.ObjectId.isValid(userId))) {
        throw errors.USER_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(alertId))) {
        throw errors.ALERT_NOT_FOUND();
    }
    const alert = await Alert.findOneAndDelete({_id: alertId, type: alertHelper.TYPE.CURRENCY, currencyCode, userId});
    if (!alert) {
        throw errors.ALERT_NOT_FOUND();
    }
};
