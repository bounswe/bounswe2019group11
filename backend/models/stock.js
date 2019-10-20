const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

    monthlyPrice: {
        type: Object
    },
    dailyPrice: {
        type: Object
    },
    stockSymbol: {
        type: String,
        required: true
    },
    stockName: {
        type: String
    }
});

module.exports = mongoose.model('Stock', stockSchema);
