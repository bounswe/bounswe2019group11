const Portfolio = require('../models/portfolio');

module.exports.getAll = async () => {
    return Portfolio.find();
}

module.exports.getById = async (portfolioID) => {
    return await  Portfolio.findOne({
        _id: portfolioID
    });
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
