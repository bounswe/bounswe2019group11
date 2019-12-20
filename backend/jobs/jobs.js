require('dotenv').config();

const database = require('../helpers/database');
database.establishConnection().then(r => console.log(new Date() + ' Database connection is initialized.'));

const CronJob = require('cron').CronJob;
const request = require('request-promise');
const Currency = require('../models/currency');
const Prediction = require('../models/prediction');
const predictionHelper = require('../helpers/prediction');
const User = require('../models/user');
const Stock = require('../models/stock');

const BASE_CURRENCY = 'USD';

const CURRENCIES = [
    'EUR',
    'JPY',
    'GBP',
    'CHF',
    'TRY',
];

const STOCKS = [
    'AAPL',
    'AMZN',
    'BA',
    'FB',
    'GOOGL',
    'MSFT',
    'NKE',
    'TKC',
];

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

class RoundRobinKeyPicker {
    constructor(keys) {
        this.keys = keys;
        this.length = keys.length;
        this.currIndex = randomInt(0, this.length - 1);
    }

    next() {
        const key = this.keys[this.currIndex];
        this.currIndex = (this.currIndex + 1) % this.length;
        return key;
    }
}

const apiKeyPicker = new RoundRobinKeyPicker(process.env.ALPHAVANTAGE_API_KEY.split(','));
const apiUrl = process.env.ALPHAVANTAGE_URL;

const intradayRatesJob = new CronJob('0 */5 * * * *', async () => {
    const params = {
        function: 'FX_INTRADAY',
        from_symbol: BASE_CURRENCY,
        interval: '5min',
    };

    const options = {
        url: apiUrl,
        qs: params,
    };

    for (let i = 0; i < CURRENCIES.length; i++) {
        const code = CURRENCIES[i];
        params.to_symbol = code;
        params.apikey = apiKeyPicker.next();
        try {
            let response = await request.get(options);
            response = JSON.parse(response);
            if (response['Meta Data']) {
                const intradayRates = response['Time Series FX (5min)'];
                const rate = intradayRates[Object.keys(intradayRates)[0]]['4. close'];
                await Currency.updateOne({code}, {intradayRates, rate});
                console.log(new Date() + ' Intraday rates and rate are updated for ' + code);
            } else {
                console.log(new Date() + ' Request to AlphaVantage failed.' + JSON.stringify(response));
            }
        } catch (err) {
            console.log(new Date() + ' Intraday rates and rate could not be updated for ' + code + '. Err: ' + err);
        }
    }
}, null, false, 'Europe/Istanbul', null, false);

const dailyRatesJob = new CronJob('00 00 00 * * *', async () => {
    const params = {
        function: 'FX_DAILY',
        from_symbol: BASE_CURRENCY,
    };

    const options = {
        url: apiUrl,
        qs: params,
    };

    for (let i = 0; i < CURRENCIES.length; i++) {
        const code = CURRENCIES[i];
        params.to_symbol = code;
        params.apikey = apiKeyPicker.next();
        try {
            let response = await request.get(options);
            response = JSON.parse(response);
            if (response['Meta Data']) {
                const dailyRates = response['Time Series FX (Daily)'];
                await Currency.updateOne({code}, {dailyRates});
                console.log(new Date() + ' Daily rates are updated for ' + code);
            } else {
                console.log(new Date() + ' Request to AlphaVantage failed. ' + JSON.stringify(response));
            }
        } catch (err) {
            console.log(new Date() + ' Daily rates could not be updated for ' + code + '. Err: ' + err);
        }
    }
}, null, false, 'Europe/Istanbul', null, false);

const intradayPriceJob = new CronJob('0 */5 * * * *', async () => {
    const params = {
        function: 'TIME_SERIES_INTRADAY',
        interval: '5min',
    };

    const options = {
        url: apiUrl,
        qs: params,
    };

    for (let i = 0; i < STOCKS.length; i++) {
        const symbol = STOCKS[i];
        params.symbol = symbol;
        params.apikey = apiKeyPicker.next();
        try {
            let response = await request.get(options);
            response = JSON.parse(response);
            if (response['Meta Data']) {
                const intradayPrices = response['Time Series (5min)'];
                const price = intradayPrices[Object.keys(intradayPrices)[0]]['4. close'];
                await Stock.updateOne({stockSymbol: symbol}, {dailyPrice: intradayPrices, price});
                console.log(new Date() + ' Intraday prices and price are updated for ' + symbol);
            } else {
                console.log(new Date() + ' Request to AlphaVantage failed.' + JSON.stringify(response));
            }
        } catch (err) {
            console.log(new Date() + ' Intraday prices and price could not be updated for ' + symbol + '. Err: ' + err);
        }
    }
}, null, false, 'Europe/Istanbul', null, false);

const dailyPricesJob = new CronJob('00 00 00 * * *', async () => {
    const params = {
        function: 'TIME_SERIES_DAILY',
    };

    const options = {
        url: apiUrl,
        qs: params,
    };

    for (let i = 0; i < STOCKS.length; i++) {
        const symbol = STOCKS[i];
        params.symbol = symbol;
        params.apikey = apiKeyPicker.next();
        try {
            let response = await request.get(options);
            response = JSON.parse(response);
            if (response['Meta Data']) {
                const dailyPrices = response['Time Series (Daily)'];
                await Stock.updateOne({stockSymbol: symbol}, {monthlyPrice: dailyPrices});
                console.log(new Date() + ' Daily prices are updated for ' + symbol);
            } else {
                console.log(new Date() + ' Request to AlphaVantage failed. ' + JSON.stringify(response));
            }
        } catch (err) {
            console.log(new Date() + ' Daily prices could not be updated for ' + symbol + '. Err: ' + err);
        }
    }
}, null, false, 'Europe/Istanbul', null, false);

const predictionJob = new CronJob('00 00 00 * * *', async () => {
    try {
        const predictions = await Prediction.find();

        const currencyCache = new Map();
        for (let i = 0; i < predictions.length; i++) {
            const prediction = predictions[i];
            if (prediction.equipmentType === predictionHelper.EQUIPMENT_TYPE.CURRENCY) {
                let currentRate;
                const currencyCode = prediction.currencyCode.toUpperCase();
                if (currencyCache.has(currencyCode)) {
                    currentRate = currencyCache.get(currencyCode);
                } else {
                    currentRate = await Currency
                        .findOne({code: currencyCode})
                        .select('rate -_id')
                        .exec();
                    currentRate = currentRate.rate;
                    currencyCache.set(currencyCode, currentRate);
                }
                const obj = {
                    $inc: {
                        totalPredictionCount: 1,
                    }
                };
                if ((prediction.snapshot <= currentRate
                    && prediction.prediction === predictionHelper.PREDICTION.INCREASE) ||
                    (prediction.snapshot > currentRate
                        && prediction.prediction === predictionHelper.PREDICTION.DECREASE)) {
                    obj['$inc'].successfulPredictionCount = 1;
                }
                await User.updateOne({_id: prediction.userId}, obj);
            }
            await Prediction.deleteOne({_id: prediction._id});
            console.log('Prediction successfully made for ' + prediction.userId);
        }
    } catch (err) {
        console.log(new Date() + ' Predictions cannot be processed. Err: ' + err);
    }

}, null, false, 'Europe/Istanbul', null, false);

predictionJob.start();
intradayRatesJob.start();
dailyRatesJob.start();
intradayPriceJob.start();
dailyPricesJob.start();
