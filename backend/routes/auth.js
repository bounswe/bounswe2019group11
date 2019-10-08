const express = require('express');
const authService = require('../services/auth');
const errors = require('../helpers/errors');

const router = express.Router();

router.post('/sign-up', async (req, res) => {
    try {
        const {name, surname, email, password, idNumber, iban} = req.body;
        const isUserExists = await authService.isUserExists(email);
        if (isUserExists) {
            res.status(400).send(errors.EMAIL_IN_USE());
            return;
        }
        await authService.signUp(name, surname, email, password, idNumber, iban);
        res.sendStatus(200);
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
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/sign-up/verification/:token', async (req, res) => {
    try {
        const verificationToken = await authService.findVerificationToken(req.params.token);
        if (!verificationToken) {
            res.status(400).send(errors.INVALID_VERIFICATION_TOKEN());
            return;
        }
        const user = await authService.getUser(verificationToken._userId);
        if (!user) {
            res.status(400).send(errors.USER_NOT_FOUND());
            return;
        }
        if (user.isVerified) {
            res.status(400).send(errors.USER_ALREADY_VERIFIED());
        } else {
            user.isVerified = true;
            await user.save();
            res.sendStatus(200);
        }
    } catch (err) {
        res.status(500).send(errors.INTERNAL_ERROR(err));
    }
});

module.exports = router;
