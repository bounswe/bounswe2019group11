const express = require('express');
const authService = require('../services/auth');

const router = express.Router();

router.post('/signUp', async (req, res) => {
    try {
        const { name, surname, email, password, idNumber, iban } = req.body;
        res.send(await authService.signUp(name, surname, email, password, idNumber, iban));
    } catch (e) {
        res.status(500).send({ error: `DatabaseError: ${e}`});
    }
});

module.exports = router;
