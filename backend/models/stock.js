const mongoose = require ('mongoose')
const stockSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required: true
    },

    monthlyPrice:{
        type: {}
    },
    dailyPrice: {
        type: {}
    },
    stockSymbol:{
        type:String
    },
    stockName:{
        type:String
    }

});


const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
