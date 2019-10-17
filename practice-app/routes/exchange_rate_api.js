const express = require('express');
const request = require('request');

const getCurrentDateRounded = require('../helpers/currency').getCurrentDateRounded;
const Currency = require('../models/currency').Currency;

const router = express.Router();

router.get('/allrates', (req,res) => {
    let from = req.query.from || 'TRY';
    getAllRates(res,from);
});

function getAllRates(res, from) {
    const reqOptions = {'url': process.env.EXCHANGE_RATE_API_URL, 'qs': {'base': from}};
    request(reqOptions, (err, response, body) => {
        if (err) {
            // If something went wrong during the request, send it to the user
            res.status(400).send({'error': '' + err});
        } else if (response.statusCode !== 200) {
            // If the endpoint returns an error code (like invalid from/to symbols)
            // send it directly to the user
            res.status(400).send(JSON.parse(body));
        } else {
            // Parse the result. Update the DB and send the result to the user
            const result = JSON.parse(body);
            const myrates = result.rates;
    //        console.log(myrates);
            res.render('all_rates.pug',{rates:myrates});
        }
    });
}

router.get('/', (req, res) => {
    // From parameter is optional. Default is 'TRY'
    let from = req.query.from || 'TRY';
    let to = req.query.to;

    if (to == null || to === '') {
        res.status(400).send({
            'error': '\'to\' parameter cannot be empty!'
        });
        return;
    }

    // First look up for the fresh record on the database
    const criteria = {'from': from, 'to': to, 'date': getCurrentDateRounded()};
    Currency.find(criteria).then((result) => {
        const data = result[0];
        if (data) {
            // Found a fresh record. Send it
            res.send({'from': from, 'to': {[to]: data['rate']}});
        } else {
            // Either there is no record for that from/to or that record is older than one day
            // Request a fresh record from the endpoint
            sendRequestToEndpoint(res, from, to);
        }
    }).catch((err) => {
        // Something went wrong on the find query.
        // Log it and try to return response from the endpoint
        console.log(err);
        sendRequestToEndpoint(res, from, to);
    });
});

router.get('/avg', (req, res) => {
    let from = req.query.from || 'TRY';
    let to = req.query.to;
    let start_date = req.query.start_date || moveDate('', -7);
    let end_date = req.query.end_date || moveDate('', 0);
    let format = req.query.format;
    if (to == null || to === '') {
        res.status(400).send({
            'error': '\'to\' parameter cannot be empty!'
        });
        return;
    }
    const startDate = new Date(start_date); 
    const endDate = new Date(end_date); 
    if (startDate.getTime() - endDate.getTime() > 0) {
        res.status(400).send({
            'error': 'start_date cannot be greater than end_date'
        });
        return;
    }
    calculateAverage(res, start_date, end_date, from, to, format);
});



router.get('/percentage', (req, res) => {
    let from = req.query.from || 'TRY';
    let to = req.query.to;
    let change_date = req.query.change_date || moveDate('', 0);
    let prev_day =  moveDate(change_date, -1);

    if (to == null || to == '') {
        res.status(400).send({
            'error': '\'to\' parameter cannot be empty!'
        });
        return;
    }
    
    calculatePercentage(res, change_date, prev_day, from, to);
    
});


function sendRequestToEndpoint(res, from, to) {
    const reqOptions = {'url': process.env.EXCHANGE_RATE_API_URL, 'qs': {'base': from, 'symbols': to}};
    request(reqOptions, (err, response, body) => {
        if (err) {
            // If something went wrong during the request, send it to the user
            res.status(400).send({'error': '' + err});
        } else if (response.statusCode !== 200) {
            // If the endpoint returns an error code (like invalid from/to symbols)
            // send it directly to the user
            res.status(400).send(JSON.parse(body));
        } else {
            // Parse the result. Update the DB and send the result to the user
            const result = JSON.parse(body);
            const criteria = {'from': from, 'to': to};
            const updateArgs = {'rate': result['rates'][to], 'date': Date.parse(result['date'])};
            const options = {'upsert': true};
            Currency.updateOne(criteria, updateArgs, options).then(() => {
                res.send({'from': from, 'to': {[to]: result['rates'][to]}});
            }).catch((err) => {
                // We couldn't update the DB. Log it and send the response to user
                console.log(err);
                res.send({'from': from, 'to': {[to]: result['rates'][to]}});
            });
        }
    });
}

function calculateAverage(res, start_date, end_date, from, to, format) {
    const reqOptions = {'url': process.env.EXCHANGE_RATE_API_HISTORY_URL, 'qs': {'start_at': start_date, 'end_at':end_date, 'base': from, 'symbols': to}};
    request(reqOptions, (err, response, body) => {
        if (err) {
            // If something went wrong during the request, send it to the user
            res.status(400).send({'error': '' + err});
        } else if (response.statusCode !== 200) {
            // If the endpoint returns an error code (like invalid from/to symbols)
            // send it directly to the user
            res.status(400).send(body);
        } else {
            const result = JSON.parse(body);
            var avg = 0;
            var count = 0;
            for (var i = 0; i < dateDiff(start_date, end_date); i++) {
                if(result['rates'][moveDate(start_date, i)]){
                    avg = avg + result['rates'][moveDate(start_date, i)][to];
                    count ++;
                }
            }
            avg = avg / count;
            if(format == 'json') {
                res.send({'from': from, 'to': to, 'start_date':start_date, 'end_date': end_date, 'average': avg});
            }else{
                res.render('avg_exchange_rate', {average: avg , start_date: start_date, end_date: end_date, from: from, to: to});
            }
        }
    });
}

function calculatePercentage(res, change_date, prev_day, from, to) {
    const reqOptions = {'url': process.env.EXCHANGE_RATE_API_HISTORY_URL, 'qs': {'start_at': prev_day, 'end_at': change_date, 'base': from, 'symbols': to}};
    request(reqOptions, (err, response, body) => {
        if (err) {
            // If something went wrong during the request, send it to the user
            res.status(400).send({'error': '' + err});
        } else if (response.statusCode !== 200) {
            // If the endpoint returns an error code (like invalid from/to symbols)
            // send it directly to the user
            res.status(400).send(body);
        } else {
            try {
                const result = JSON.parse(body);
                var perc = 0;
                var firstValue = 0;
                firstValue = result['rates'][moveDate(change_date,0)][to];
                var secondValue = 0;
                secondValue = result['rates'][moveDate(prev_day,0)][to];
                perc = (firstValue-secondValue)/secondValue *100;

                res.send({'from': from, 'to': to, 'change_date':change_date, '% change': perc});
            } catch (e) {
                res.status(400).send({
                    'error': 'Data is not available on the endpoint yet! Try with different parameters'
                });
            }
        }
    });
}

function moveDate(start_date, daysToMove) {
    if(start_date){
        var date_ = new Date(start_date);
    }else{
        var date_ = new Date();
    }
    date_.setDate(date_.getDate() + daysToMove);
    return date_.toISOString().slice(0,10);
}

function dateDiff(start_date, end_date) {
    var oneDay = 24 * 60 * 60 * 1000; 
    var startDate = new Date(start_date); 
    var endDate = new Date(end_date); 
    return Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / (oneDay)));
}

module.exports = router;
