const mongoose = require ('mongoose')
const Stock = require('./stock')
const portfolioSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    stocks: [{type: mongoose.Schema.Types.ObjectId,ref:'Stock',autopopulate: true}]

});
portfolioSchema.plugin(require('mongoose-autopopulate'));

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
