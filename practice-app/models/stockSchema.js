const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
	information: {
        type: String,
        required: true
        //unique: true
    },
	symbol: {
        type: String,
        required: true
        //unique: true
    },
	lastRefreshed: {
        type: String,
        required: true
        //unique: true
    },
	interval: {
        type: String,
        required: true
        //unique: true
    },
	outputSize: {
        type: String,
        required: true
        //unique: true
    },
	timeZone: {
        type: String,
        required: true
        //unique: true
    },
    dateData: {
        type: String,
        //required: true,
        unique: true
},
        open: {
			type: String
		},
		high: {
			type: String
		},
		low: {
			type: String
		},
		close: {
			type: String
		},
		volume: {
			type: String
		}
    //}
});

module.exports = stockSchema;
