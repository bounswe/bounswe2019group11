const express = require('express');
const request = require('request');

const getCurrentDateRounded = require('../helpers/currency').getCurrentDateRounded;
const Currency = require('../models/currency').Currency;

const router = express.Router();

router.get('/', (req, res) => {
    // From parameter is optional. Default is 'TRY'
    let from = req.query.from || 'TRY';
    let to = req.query.to;

    if (to == null) {
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

function sendRequestToEndpoint(res, from, to) {
    const reqOptions = {'url': process.env.EXCHANGE_RATE_API_URL, 'qs': {'base': from, 'symbols': to}};
    request(reqOptions, (err, response, body) => {
        if (err) {
            // If something went wrong during the request, send it to the user
            res.status(400).send({'error': '' + err});
        } else if (response.statusCode !== 200) {
            // If the endpoint returns an error code (like invalid from/to symbols)
            // send it directly to the user
            res.status(400).send(body);
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

module.exports = router;
