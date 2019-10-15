const TradingEquipment = require('./tradingEquipment')

const StockEquipment = TradingEquipment.discriminator('StockEquipment',new mongoose.Schema({
    stockSymbol:{
        type:String
    },
    stockName:{
        type:String
    }

}))

module.exports = mongoose.model('StockEquipment',StockEquipment)