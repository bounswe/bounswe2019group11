const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const notificationService = require('../services/notification');
const errors = require('../helpers/errors');

const router = express.Router();

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = req.token && req.token.data && req.token.data._id;
        const response = await notificationService.getAll(userId);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(errors.INTERNAL_ERROR(err));
    }
});

router.post('/:id', isAuthenticated, async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.token && req.token.data && req.token.data._id;
        await notificationService.discardNotification(notificationId, userId);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'NotificationNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

module.exports = router;
