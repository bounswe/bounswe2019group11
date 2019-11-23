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
