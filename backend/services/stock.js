const request = require('request-promise');
const Stock = require('../models/stock');
const errors = require('../helpers/errors');
const mongoose = require('mongoose');

const apiUrl = process.env.ALPHAVANTAGE_URL;
const apiKeys = process.env.ALPHAVANTAGE_API_KEY;
const apiKeyArr = apiKeys.split(',');
const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};


const getDailyPrice = async (symbol) => {
    const rand = getRandomInt(apiKeyArr.length);
    const apiKey = apiKeyArr[rand];
    console.log(apiKey + " daily");
    const dailyParams = {function: "TIME_SERIES_INTRADAY", symbol: symbol, interval: "5min", apikey: apiKey};
    const options = {
        uri: apiUrl,
        qs: dailyParams
    };
    let response = await request.get(options);
    response = JSON.parse(response);
    if (response['Meta Data']) {
        return response['Time Series (5min)'];
    } else {
        console.log("Error in daily Data")
    }

};


const getMonthlyPrice = async (symbol) => {
    const rand = getRandomInt(apiKeyArr.length);
    const apiKey = apiKeyArr[rand];
    console.log(apiKey + " monthly");
    const dailyParams = {function: "TIME_SERIES_DAILY", symbol: symbol, apikey: apiKey};
    const options = {
        uri: apiUrl,
        qs: dailyParams
    };
    let response = await request.get(options);
    response = JSON.parse(response);
    if (response['Meta Data']) {
        return response['Time Series (Daily)'];
    } else {
        console.log("Error in Montly Data")
    }

};


module.exports.getAll = async () => {
    return await Stock.find();
};

module.exports.getById = async (_id) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw errors.STOCK_NOT_FOUND();
    }
    const stock = await Stock.findOne({
        _id,
    });
    if (!stock) {
        throw errors.STOCK_NOT_FOUND();
    }
    // Parallel API calls
    const promises = [getDailyPrice(stock.stockSymbol), getMonthlyPrice(stock.stockSymbol)];
    const resolves = await Promise.all(promises);
    stock['dailyPrice'] = resolves[0];
    stock['monthlyPrice'] = resolves[1];
    return stock;
};

module.exports.create = async (theStock) => {
    const stock = {...theStock};
    const createdStock = await Stock.create(stock);
    return createdStock;
};
