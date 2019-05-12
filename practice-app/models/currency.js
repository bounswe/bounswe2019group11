const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CurrencySchema = new Schema({
    // Symbol of the base currency
    from: {
        type: String,
        required: true,
    },

    // Symbol of the currency to be converted
    to: {
        type: String,
        required: true
    },

    // Rate of from/to
    rate: {
        type: Number,
        required: true
    },

    // Date in which the rate is calculated as UNIX timestamp
    date: {
        type: Number,
        required: true,
    }
});

const Currency = mongoose.model('Currency', CurrencySchema);

module.exports.Currency = Currency;
