const Portfolio = require('../models/portfolio');
const errors = require('../helpers/errors');
module.exports.getAll = async () => {
    return Portfolio.find()
        .populate('stocks')
        .exec();
}

module.exports.getById = async (portfolioID) => {
    return await  Portfolio.findOne({
        _id: portfolioID
    })
    .populate('stocks')
    .exec();

}

module.exports.getByUserId = async (userID) =>{
    return await find({
        userId: userID
    })
}

module.exports.create = async (thePortfolio) => {
    const portfolio = {...thePortfolio};
    const createdPortfolio = await Portfolio.create(portfolio);
    return createdPortfolio;
};

module.exports.addStock = async (theStock,portfolioID) => {
    const stockToBeAdded= {...theStock};
    const portfolioToAdd = await Portfolio.findOne({
        _id: portfolioID
    });
    portfolioToAdd.stocks.push(stockToBeAdded);
    await  portfolioToAdd.save();
    return await this.getById(portfolioID);

};

module.exports.removeStock = async (theStock,portfolioID) => {
    const stockToBeDeleted= {...theStock};
    const portfolioToBeModified = await Portfolio.findOne({
        _id: portfolioID
    })
        .populate('stocks')
        .exec();
    const index = portfolioToBeModified.stocks.findIndex(s => s._id == stockToBeDeleted._id);
    if(index == -1){
        throw errors.STOCK_NOT_FOUND();
    }else{

        portfolioToBeModified.stocks.pull({_id:theStock._id}); //Deletes the given id from stock array
        return  await  portfolioToBeModified.save();


    }

};


