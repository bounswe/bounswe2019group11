const mongoose = require('mongoose');

// This is the Schema used to model the MongoDB using Mongoose
// Format of the JSON output of the Alpha Vantage API is used to form this template.

const stockSchema = new mongoose.Schema({
    // general information from "meta data"
    information: {
        type: String,
        required: true
    },
    // symbol information from "meta data"
    symbol: {
        type: String,
        required: true
    },
    // latest refreshment information from "meta data"
    lastRefreshed: {
        type: String,
        required: true
    },
    // interval information from "meta data"
    interval: {
        type: String,
        required: true
    },
    // output size information from "meta data"
    outputSize: {
        type: String,
        required: true
    },
    // time zone information from "meta data"
    timeZone: {
        type: String,
        required: true
    },
    // corresponding interval information from "time series"
    dateData: {
        type: String,
        unique: true
    },
    // opening value from the corresponding interval in "time series"
    open: {
        type: String
    },
    // highest value from the corresponding interval in "time series"
    high: {
        type: String
    },
    // corresponding interval information from the corresponding interval in "time series"
    low: {
        type: String
    },
    // closing value from the corresponding interval in "time series"
    close: {
        type: String
    },
    // volume information from the corresponding interval in "time series"
    volume: {
        type: String
    }
   
});

module.exports = stockSchema;



