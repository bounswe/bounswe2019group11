const Investments = require('../models/investments');
const errors = require('../helpers/errors');

module.exports.getAll = async () => {
    return Investments.find()
}

module.exports.getById = async (investmentsID) => {
    return await  Investments.findOne({
        _id: investmentsID
    })
}

module.exports.getByUserId = async (userID) =>{
    return await Investments.find({
        userId: userID
    })
}

module.exports.create = async (myInvestments) => {
    const investments = {...myInvestments};
    const createdInvestments = await Investments.create(investments);
    return createdInvestments;
};

module.exports.addStock = async (theStock,theAmount,investmentsID) => {
    const stockToBeAdded= {...theStock};
    const investmentsToAdd = await Investments.findOne({
        _id: investmentsID
    });
    investmentsToAdd.stocks.push({stock: stockToBeAdded,amount: theAmount});
    await  investmentsToAdd.save();
    return await this.getById(investmentsID);
};

module.exports.addTradingEquipment = async (theTradingEquipment,theAmount,investmentsID) => {
    const teToBeAdded= {...theTradingEquipment};
    const investmentsToAdd = await Investments.findOne({
        _id: investmentsID
    });
    investmentsToAdd.tradingEquipments.push({tradingEquipment: teToBeAdded,amount: theAmount});
    await  investmentsToAdd.save();
    return await this.getById(investmentsID);
};

module.exports.removeStock = async (theStock,investmentsID) => {
    const stockToBeDeleted= {...theStock};
    const investmentsToBeModified = await Investments.findOne({
        _id: investmentsID
    });
    const index = investmentsToBeModified.stocks.findIndex(s => s.stock._id == stockToBeDeleted._id);
    if(index == -1){
        throw errors.STOCK_NOT_FOUND();
    }else{
        investmentsToBeModified.stocks.pull({stock:{_id:theStock._id}}); //Deletes the given id from stock array
        return  await  investmentsToBeModified.save();
    }
};

module.exports.removeTradingEquipment = async (theTradingEquipment,investmentsID) => {
    const teToBeDeleted= {...theTradingEquipment};
    const investmentsToBeModified = await Investments.findOne({
        _id: investmentsID
    });
    const index = investmentsToBeModified.tradingEquipments.findIndex(s => s.tradingEquipment._id == teToBeDeleted._id);
    if(index == -1){
        throw errors.TRADING_EQUIPMENT_NOT_FOUND();
    }else{
        investmentsToBeModified.tradingEquipments.pull({tradingEquipment:{_id:theTradingEquipment._id}}); //Deletes the given id from trading equipment array
        return  await  investmentsToBeModified.save();
    }
};


