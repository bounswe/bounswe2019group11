const TradingEquipment = require('../models/tradingEquipment')
const StockEquipment = require ('../models/stock');

const getStockDailyPrice = async (symbol) => {

}

module.exports.getAll = async ()=>{
    return await TradingEquipment.find();
};

module.exports.getById= async (id)=>{
    return await TradingEquipment.findOne({
        _id:id
    });
}

module.exports.getStockAll = async ()=>{
    return await StockEquipment.find();
};

module.exports.getStockById= async (id)=>{
    return await StockEquipment.findOne({
        _id:id
    });
}

module.exports.createStock = async (theStock) => {
    const stock = {...theStock};
    const createdStock = await StockEquipment.create(stock);
    return createdStock;
};