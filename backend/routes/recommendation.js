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
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});


router.get('/articles', isAuthenticated, async (req, res) => {
    try {
        const userId = req.token && req.token.data && req.token.data._id;
        const response = await recommendationService.getRecommendedArticles(userId);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

module.exports = router;
