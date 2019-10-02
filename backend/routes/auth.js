const express = require('express');
const authService = require('../services/auth');

const router = express.Router();

router.post('/sign-up', async (req, res) => {
    try {
        const { name, surname, email, password, idNumber, iban } = req.body;
        res.status(200).send(await authService.signUp(name, surname, email, password, idNumber, iban));
    } catch (e) {
        res.status(500).send({ error: `DatabaseError: ${e}`});
    }
});

module.exports = router;
