const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const moneyService = require('../services/money');
const errors = require('../helpers/errors');
const isTrader = require('../middlewares/isTrader');

const router = express.Router();

router.get('/', isAuthenticated, isTrader, async (req, res) => {
    try {
        const userId = req.token && req.token.data && req.token.data._id;
        const response = await moneyService.get(userId);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(errors.INTERNAL_ERROR(err));
    }
});

router.post('/deposit/:amount', isAuthenticated, isTrader, async (req, res) => {
    try {
        const userId = req.token && req.token.data && req.token.data._id;
        const amount = req.params.amount;
        await moneyService.deposit(userId, amount);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'InvalidAmount') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/withdraw/:amount', isAuthenticated, isTrader, async (req, res) => {
    try {
        const userId = req.token && req.token.data && req.token.data._id;
        const amount = req.params.amount;
        await moneyService.withdraw(userId, amount);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'InvalidAmount' || err.name === 'InsufficientFund') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

module.exports = router;
