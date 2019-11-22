require('dotenv').config({
    path: '../.env'
});

const database = require('../helpers/database');
database.establishConnection().then(r => console.log(new Date() + ' Database connection is initialized.'));

const CronJob = require('cron').CronJob;
const request = require('request-promise');
const Currency = require('../models/currency');

const BASE_CURRENCY = 'USD';

const CURRENCIES = [
    'EUR',
    'JPY',
    'GBP',
    'CHF',
    'TRY',
];

class RoundRobinKeyPicker {
    constructor(keys) {
        this.keys = keys;
        this.length = keys.length;
        this.currIndex = 0;
    }

    next() {
        const item = this.keys[this.currIndex];
        this.currIndex = (this.currIndex + 1) % this.length;
        return item;
    }
}

//const apiKeyPicker = new RoundRobinKeyPicker(process.env.ALPHAVANTAGE_API_KEY.split(','));
const apiKeyPicker = new RoundRobinKeyPicker('CA54MMMQMH7JURN0,H0V9T7JGA6PZ8210'.split(','));
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
            }
            else {
                console.log(new Date() + ' Request to AlphaVantage failed.' + response);
            }
        } catch (err) {
            console.log(new Date() + ' Intraday rates and rate could not be updated for ' + code + '. Err: '+  err);
        }
    }
});


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
                console.log(new Date() + ' Request to AlphaVantage failed. ' + response);
            }
        } catch (err) {
            console.log(new Date() + ' Daily rates could not be updated for ' + code + '. Err: '+ err);
        }
    }
});

intradayRatesJob.start();
dailyRatesJob.start();
