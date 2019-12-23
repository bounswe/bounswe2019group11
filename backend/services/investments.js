const Investments = require('../models/investments');
const moneyService = require('../services/money');
const User = require('../models/user');
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
    const user = await User.findOne({
        _id: investmentsToAdd.userId
    });
    const dollarAmount = theAmount * stockToBeAdded.price
    const index = investmentsToAdd.stocks.findIndex(s => s.stock._id == stockToBeAdded._id);
    await moneyService.withdraw(user._id,dollarAmount)
    if(index == -1){
        investmentsToAdd.stocks.push({stock: stockToBeAdded,amount: theAmount});
        await  investmentsToAdd.save();
        return await this.getById(investmentsID);
    } else{   
        investmentsToAdd.stocks[index].amount += theAmount;
        await  investmentsToAdd.save();
        return await this.getById(investmentsID);
    }
};

module.exports.addCurrency = async (theCurrency,theAmount,investmentsID) => {
    const currencyToBeAdded= {...theCurrency};
    const investmentsToAdd = await Investments.findOne({
        _id: investmentsID
    });
    const user = await User.findOne({
        _id: investmentsToAdd.userId
    });
    const dollarAmount = theAmount / currencyToBeAdded.rate
    const index = investmentsToAdd.currencies.findIndex(c => c.currency._id == currencyToBeAdded._id);
    await moneyService.withdraw(user._id,dollarAmount)
    if(index == -1){
        investmentsToAdd.currencies.push({currency: currencyToBeAdded,amount: theAmount});
        await investmentsToAdd.save();
        return await this.getById(investmentsID);
    } else{
        investmentsToAdd.currencies[index].amount += theAmount;
        await  investmentsToAdd.save();
        return await this.getById(investmentsID);
    }
};

module.exports.removeStock = async (theStock, theAmount, investmentsID) => {
    const stockToBeDeleted= {...theStock};
    const investmentsToBeModified = await Investments.findOne({
        _id: investmentsID
    });
    const dollarAmount = theAmount * stockToBeAdded.price
    const index = investmentsToBeModified.stocks.findIndex(s => s.stock._id == stockToBeDeleted._id);
    if(index == -1){
        throw errors.STOCK_NOT_FOUND();
    }else{
        if (investmentsToBeModified.stocks[index].amount < theAmount){
            throw errors.INSUFFICIENT_STOCK();
        } else if(investmentsToBeModified.stocks[index].amount == theAmount){
            investmentsToBeModified.stocks.splice(index,1); //Deletes the given id from currency array
        } else {
            investmentsToBeModified.stocks[index].amount -= theAmount;            
        }
        await moneyService.deposit(investmentsToBeModified.userId,dollarAmount);
        await  investmentsToBeModified.save();
        return await this.getById(investmentsID);
    }
};

module.exports.removeCurrency = async (theCurrency,theAmount,investmentsID) => {
    const currencyToBeDeleted= {...theCurrency};
    const investmentsToBeModified = await Investments.findOne({
        _id: investmentsID
    });
    const dollarAmount = theAmount / currencyToBeAdded.rate
    const index = investmentsToBeModified.currencies.findIndex(c => c.currency._id == currencyToBeDeleted._id);
    await moneyService.deposit(user._id,dollarAmount);
    if(index == -1){
        throw errors.STOCK_NOT_FOUND();
    }else{
        if (investmentsToBeModified.currencies[index].amount < theAmount){
            throw errors.INSUFFICIENT_CURRENCY();
        } else if(investmentsToBeModified.currencies[index].amount == theAmount){
            investmentsToBeModified.currencies.splice(index,1); //Deletes the given id from currency array
        } else {
            investmentsToBeModified.currencies[index].amount -= theAmount;            
        }
        await moneyService.deposit(investmentsToBeModified.userId,dollarAmount);
        await  investmentsToBeModified.save();
        return await this.getById(investmentsID);
    }
};

module.exports.exchangeCurrency = async (fromCurrency, toCurrency, fromAmount,investmentsID) => {
    const fromCurr= {...fromCurrency};
    const toCurr= {...toCurrency};
    const investmentsToBeModified = await Investments.findOne({
        _id: investmentsID
    });
    const index = investmentsToBeModified.currencies.findIndex(c => c.currency._id == fromCurr._id);
    if(index == -1){
        throw errors.TRADING_EQUIPMENT_NOT_FOUND();
    }else{
        if(investmentsToBeModified.currencies[index].amount < fromAmount){
            throw errors.INSUFFICIENT_FUND();
        } else {
            investmentsToBeModified.currencies[index].amount -= fromAmount;
            toAmount = fromAmount * toCurr.rate / fromCurr.rate;
            await this.addCurrency(toCurr, toAmount, investmentsID)
            return  await  investmentsToBeModified.save();
        }
    }
};

module.exports.exchangeStock = async (fromStock, toStock, fromAmount,investmentsID) => {
    const fromStck= {...fromStock};
    const toStck= {...toStock};
    const investmentsToBeModified = await Investments.findOne({
        _id: investmentsID
    });
    const index = investmentsToBeModified.stocks.findIndex(c => c.stock._id == fromStck._id);
    if(index == -1){
        throw errors.TRADING_EQUIPMENT_NOT_FOUND();
    }else{
        if(investmentsToBeModified.stocks[index].amount < fromAmount){
            throw errors.INSUFFICIENT_FUND();
        } else {
            investmentsToBeModified.stocks[index].amount -= fromAmount;
            toAmount = fromAmount * fromStck.price / toStck.price;
            await this.addStock(toStck, toAmount, investmentsID)
            return  await  investmentsToBeModified.save();
        }
    }
};

