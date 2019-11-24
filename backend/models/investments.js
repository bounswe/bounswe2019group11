const mongoose = require ('mongoose')
const investmentsSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true
    },
    stocks: [
        {
            stock: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Stock',
            },
            amount: {
                type: Number,
                required: true,
            },
            _id:false,
            autopopulate: true
        }],
    tradingEquipments: [
        {
            tradingEquipment: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'TradingEquipment'
            },
            amount: {
                type: Number,
                required: true,
            },
            _id:false,
            autopopulate: true
        }
    ],
    currencies: [
        {
            currency: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Currency',
            },
            amount: {
                type: Number,
                required: true,
            },
            _id:false,
            autopopulate: true
        }
    ]
});

investmentsSchema.plugin(require('mongoose-autopopulate'));

const Investments = mongoose.model('Investments', investmentsSchema);

module.exports = Investments;
