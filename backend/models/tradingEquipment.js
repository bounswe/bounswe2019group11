const mongoose  = require('mongoose');

const tradingEquipmentSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required: true
    },

    monthlyPrice:{
        type: Object
    },
    dailyPrice: {
        type: Object
    }

});

const TradingEquipment = mongoose.model('TradingEquipment', tradingEquipmentSchema);

module.exports = TradingEquipment;
