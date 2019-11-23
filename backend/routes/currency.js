const express = require('express');
const currencyService = require('../services/currency');
const errors = require('../helpers/errors');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await currencyService.getAll();
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(errors.INTERNAL_ERROR(err));
    }
});

module.exports = router;
