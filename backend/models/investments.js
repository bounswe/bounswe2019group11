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
                autopopulate: true
            },
            amount: {
                type: Number,
                required: true,
            },
            _id:false
      
        }
    ],
    currencies: [
        {
            currency: {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Currency',
                autopopulate: true
            },
            amount: {
                type: Number,
                required: true,
            },
            _id:false
        }
    ]
});

investmentsSchema.plugin(require('mongoose-autopopulate'));

const Investments = mongoose.model('Investments', investmentsSchema);

module.exports = Investments;
