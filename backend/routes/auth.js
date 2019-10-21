const express = require('express');
const authService = require('../services/auth');
const errors = require('../helpers/errors');

const router = express.Router();

router.post('/sign-up', async (req, res) => {
    try {
        const {name, surname, email, password, idNumber, iban, location} = req.body;
        const isUserExists = await authService.isUserExists(email);
        if (isUserExists) {
            res.status(400).send(errors.EMAIL_IN_USE());
            return;
        }
        await authService.signUp(name, surname, email, password, idNumber, iban, location);
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
                    case 'InvalidLatitude':
                        causes.push(errors.INVALID_LATITUDE());
                        break;
                    case 'InvalidLongitude':
                        causes.push(errors.INVALID_LONGITUDE());
                        break;
                    case 'InvalidIdNumber':
                        causes.push(errors.INVALID_ID_NUMBER());
                        break;
                    case 'InvalidIban':
                        causes.push(errors.INVALID_IBAN());
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

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const response = await authService.login(email, password);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'InvalidCredentials' || err.name === 'UserNotVerified') {
            res.status(401).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/sign-up/verification/resend', async (req, res) => {
    try {
        const email = req.body.email;
        await authService.resendVerificationMail(email);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'UserNotFound' || err.name === 'UserAlreadyVerified') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

module.exports = router;
