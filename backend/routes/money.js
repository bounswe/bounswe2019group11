const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const moneyService = require('../services/money');
const errors = require('../helpers/errors');

const router = express.Router();

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = req.token && req.token.data && req.token.data._id;
        const response = await moneyService.get(userId);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(errors.INTERNAL_ERROR(err));
    }
});


module.exports = router;
