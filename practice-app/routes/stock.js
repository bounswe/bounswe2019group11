var express = require('express');
var router = express.Router();
var request = require('request');
require('dotenv').config({path:'.env'});
var app = express();

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
	});  
});

module.exports = router;
