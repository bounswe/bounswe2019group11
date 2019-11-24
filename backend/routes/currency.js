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

router.get('/:code', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await currencyService.get(code);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/:code/intraday', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await currencyService.getIntraday(code);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/:code/last-week', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await currencyService.getLastWeek(code);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/:code/last-month', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await currencyService.getLastMonth(code);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/:code/last-100', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await currencyService.getLast100(code);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/:code/full', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await currencyService.getLastFull(code);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

module.exports = router;
