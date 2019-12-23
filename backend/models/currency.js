const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
      type: String,
      required: true
    },
    rate: {
        type: Number,
        required: true
    },
    dailyRates: {
        type: Object,
        _id: false,
        default: {}
    },
    intradayRates: {
        type: Object,
        _id: false,
        default: {},
    },
});

currencySchema.index({code: 'text', name: 'text'});

const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;
