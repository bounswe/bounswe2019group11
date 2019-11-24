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

module.exports.addCurrency = async (theCurrency,theAmount,investmentsID) => {
    const currencyToBeAdded= {...theCurrency};
    const investmentsToAdd = await Investments.findOne({
        _id: investmentsID
    });
    investmentsToAdd.currencies.push({currency: currencyToBeAdded,amount: theAmount});
    await  investmentsToAdd.save();
    return await this.getById(investmentsID);
};

module.exports.removeStock = async (theStock,investmentsID) => {
    const stockToBeDeleted= {...theStock};
    const investmentsToBeModified = await Investments.findOne({
        _id: investmentsID
    });
    const index = investmentsToBeModified.stocks.findIndex(s => s.stock._id.toString() == stockToBeDeleted._id.toString());
    if(index == -1){
        throw errors.STOCK_NOT_FOUND();
    }else{
        investmentsToBeModified.stocks.splice(index,1); //Deletes the given id from stock array
        return  await  investmentsToBeModified.save();
    }
};

module.exports.removeCurrency = async (theCurrency,investmentsID) => {
    const currencyToBeDeleted= {...theCurrency};
    const investmentsToBeModified = await Investments.findOne({
        _id: investmentsID
    });
    const index = investmentsToBeModified.currencies.findIndex(c => c.currency._id.toString() == currencyToBeDeleted._id.toString());
    if(index == -1){
        throw errors.TRADING_EQUIPMENT_NOT_FOUND();
    }else{
        investmentsToBeModified.currencies.splice(index,1); //Deletes the given id from currency array
        return  await  investmentsToBeModified.save();
    }
};


