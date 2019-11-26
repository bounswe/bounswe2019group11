const mongoose = require('mongoose');
const EQUIPMENT_TYPE = require('../helpers/prediction').EQUIPMENT_TYPE;
const PREDICTION = require('../helpers/prediction').PREDICTION;

const predictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    currencyCode: {
        type: String,
    },
    stockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
    },
    equipmentType: {
        type: Number,
        required: true,
        enum: [EQUIPMENT_TYPE.CURRENCY, EQUIPMENT_TYPE.STOCK],
    },
    snapshot: {
        type: Number,
        required: true,
    },
    prediction: {
        type: Number,
        required: true,
        enum: [PREDICTION.DECREASE, PREDICTION.DECREASE],
    }
});

const Prediction = mongoose.model('Prediction', predictionSchema);
module.exports = Prediction;
