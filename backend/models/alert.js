const mongoose = require('mongoose');
const alertHelper = require('../helpers/alert');

const alertSchema = new mongoose.Schema({
    type: {
        type: Number,
        required: true,
        enum: [alertHelper.TYPE.CURRENCY, alertHelper.TYPE.STOCK],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    direction: {
        type: Number,
        required: true,
        enum: [alertHelper.DIRECTION.ABOVE, alertHelper.DIRECTION.BELOW]
    },
    rate: {
        type: Number,
        required: true,
    },
    stockId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null,
        ref: 'Stock'
    },
    currencyCode: {
        type: String,
        required: false,
        default: ""
    }
});

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;
