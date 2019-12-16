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
        type: Object,
        _id: false,
        default: {}
    },
    dailyPrice: {
        type: Object,
        _id: false,
        default: {}
    },
    stockSymbol: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Stock', stockSchema);
