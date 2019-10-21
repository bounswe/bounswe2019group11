const express = require('express');
const profileService = require('../services/profile');
const errors = require('../helpers/errors');

const router = express.Router();

router.post('/lost-password', async (req, res) => {
    try {
        const email = req.body.email;
        await profileService.sendLostPasswordEmail(email);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/lost-password/reset', async (req, res) => {
    try {
        const {token, password} = req.body;
        await profileService.resetPassword(token, password);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'InvalidLostPasswordToken' || err.name === 'UserNotFound' || err.name === 'InvalidPassword') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

module.exports = router;
