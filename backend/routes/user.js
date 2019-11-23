const express = require('express');
const userService = require('../services/user');
const errors = require('../helpers/errors');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await userService.getAll();
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(errors.INTERNAL_ERROR(err));
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.getById(id);
        res.status(200).send(user);
    } catch (err) {
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});


router.post('/lost-password', async (req, res) => {
    try {
        const email = req.body.email;
        await userService.sendLostPasswordEmail(email);
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
        await userService.resetPassword(token, password);
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
