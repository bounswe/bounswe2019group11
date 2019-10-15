const mongoose  = require('mongoose');

var options = {discriminatorKey: 'kind'};
const tradingEquipmentSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    sellPrice:{
        type: Number,
        required: true
    },
    buyPrice:{
        type: Number,
        required: true
    },
    monthlyPrice:{
        type: Array,
    },
    dailyPrice: {
        type: Array
    }

},options);

const TradingEquipment = mongoose.model('TradingEquipment', tradingEquipmentSchema);

module.exports = TradingEquipment;
