const express = require('express');
const authService = require('../services/auth');
const errors = require('../helpers/errors');

const router = express.Router();

router.post('/sign-up', async (req, res) => {
    try {
        const {name, surname, email, password, idNumber, iban} = req.body;
        res.status(200).send(await authService.signUp(name, surname, email, password, idNumber, iban));
    } catch (err) {
        if (err.name === 'ValidationError') {
            const causes = [];
            for (const field in err.errors) {
                switch (err.errors[field].message) {
                    case 'InvalidName':
                        causes.push(errors.INVALID_NAME());
                        break;
                    case 'InvalidSurname':
                        causes.push(errors.INVALID_SURNAME());
                        break;
                    case 'InvalidEmail':
                        causes.push(errors.INVALID_EMAIL());
                        break;
                    case 'InvalidPassword':
                        causes.push(errors.INVALID_PASSWORD());
                        break;
                    default:
                        causes.push(errors.UNKNOWN_VALIDATION_ERROR(err.errors[field]));
                }
            }
            res.status(400).send(errors.VALIDATION_ERROR(causes));
        } else {
            res.status(500).send(errors.DATABASE_ERROR(err));
        }
    }
});

module.exports = router;
