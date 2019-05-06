var express = require('express');
var router = express.Router();
var request = require('request');
var date = require('date-and-time');
require('dotenv').config({path:'.env'});
var app = express();

const Stocks = require('../models/stockSchema');
const StocksData = mongoose.model('StocksData', Stocks);

// Parse incoming request data
router.use(express.json());
router.use(express.urlencoded({extended: false}));


// Use middleware to set the default Content-Type to json
router.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
}); 


router.get('/',(req,res) => {

	// Extract the parameters.
	// For detail of parameters: https://www.alphavantage.co/documentation/
	var parameters = {
		function: req.query.function,
		symbol: req.query.symbol,
		interval: req.query.interval,
		apikey: process.env.STOCK_API_KEY
	};

	// Get dara from the Aplha Vontage API and return the results.
	request({url:process.env.STOCK_API_URL, qs:parameters}, function(error,response, body) {
		if(!error && response.statusCode == 200) {
			res.status(200).send(body);
		}

		var obj = JSON.parse(body);
	   	var firstInterval = date.parse(obj['Meta Data']['3. Last Refreshed'], 'YYYY-MM-DD HH:mm:ss');
	    	var dataInterval = parameters.interval.replace(/(^\d+)(.+$)/i,'$1');
	    
	    for( var i = firstInterval ; obj["Time Series (" +parameters.interval +")" ][date.format(i, 'YYYY-MM-DD HH:mm:ss')] ; i = date.addMinutes(i, -dataInterval ) ) {
	      StocksData.create(
	        {
	          information : obj['Meta Data']['1. Information'],
	          symbol : obj['Meta Data']['2. Symbol'],
	          lastRefreshed :  obj['Meta Data']['3. Last Refreshed'],
	          interval: obj['Meta Data']['4. Interval'],
	          outputSize: obj['Meta Data']['5. Output Size'],
	          timeZone: obj['Meta Data']['6. Time Zone'],
	          dateData: date.format(i, 'YYYY-MM-DD HH:mm:ss'),
	          open: obj["Time Series (" +parameters.interval +")" ][date.format(i, 'YYYY-MM-DD HH:mm:ss')]['1. open'],
	          high: obj["Time Series (" +parameters.interval +")" ][date.format(i, 'YYYY-MM-DD HH:mm:ss')]['2. high'],
	          low: obj["Time Series (" +parameters.interval +")" ][date.format(i, 'YYYY-MM-DD HH:mm:ss')]['3. low'],
	          close: obj["Time Series (" +parameters.interval +")" ][date.format(i, 'YYYY-MM-DD HH:mm:ss')]['4. close'],
	          volume: obj["Time Series (" +parameters.interval +")" ][date.format(i, 'YYYY-MM-DD HH:mm:ss')]['5. volume']
	        }
	      );
	    }
	    
	  }); 
});

module.exports = router;
