const express = require('express');
const router = express.Router();
const stockService = require('../services/stock');
const errors = require('../helpers/errors');

router.get('/', async (req, res) => {
    try {
        const response = await stockService.getAll();
        res.status(200).json(response);
    } catch (e) {
        res.sendStatus(503);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const Id = req.params.id;
        const response = await stockService.getById(Id);
        res.status(200).json(response);
    } catch (err) {
        if (err.name === 'StockNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/', async (req, res) => {
    try {
        const theStock = {...req.body};
        const response = await stockService.create(theStock);
        res.status(200).json(response);
    } catch (e) {
        res.status(503).json(e)
    }
});

module.exports = router;
