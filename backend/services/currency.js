const Currency = require('../models/currency');
const errors = require('../helpers/errors');

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
