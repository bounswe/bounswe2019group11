const mongoose = require('mongoose');
const alertHelper = require('../helpers/alert');

const alertNotificationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    type: {
        type: Number,
        required: true,
        enum: [alertHelper.TYPE.STOCK, alertHelper.TYPE.CURRENCY],
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
    currentRate: {
        type: Number,
        required: true,
    },
    stockSymbol: {
      type: String,
      required: false,
      default: '',
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

const AlertNotification = mongoose.model('AlertNotification', alertNotificationSchema);
module.exports = AlertNotification;
