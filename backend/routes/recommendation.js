const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const recommendationService = require('../services/recommendation');
const errors = require('../helpers/errors');

const router = express.Router();

router.get('/nearby-users', isAuthenticated, async (req, res) => {
    try {
        const userId = req.token && req.token.data && req.token.data._id;
        const response = await recommendationService.getNearbyUsers(userId);
        res.status(200).send(response);
    } catch (err) {
        err.status(500).send(errors.INTERNAL_ERROR(err));
    }
});

module.exports = router;
