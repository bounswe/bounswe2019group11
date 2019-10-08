const mongoose  = require('mongoose');

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
    }
})

const TradingEquipment = mongoose.model('TradingEquipment', tradingEquipmentSchema);
module.exports = TradingEquipment;