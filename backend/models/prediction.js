const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    currencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency',
    },
    stockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
    },
    equipmentType: {
        type: Number,
        required: true,
        enum: [0, 1], // 0 for currency, 1 for stock
    },
    snapshot: {
        type: Number,
        required: true,
    },
    prediction: {
        type: Number,
        required: true,
        enum: [-1, 1]
    }
});

const Prediction = mongoose.model('Prediction', predictionSchema);
module.exports = Prediction;
