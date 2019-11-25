const express = require('express');
const currencyService = require('../services/currency');
const errors = require('../helpers/errors');
const isAuthenticated = require('../middlewares/isAuthenticated');
const router = express.Router();
const predictionHelper = require('../helpers/prediction');

router.get('/', async (req, res) => {
    try {
        const response = await currencyService.getAll();
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(errors.INTERNAL_ERROR(err));
    }
});

router.get('/:code', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await currencyService.get(code);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/:code/predict-increase', isAuthenticated, async (req, res) => {
    try {
        const code = req.params.code;
        const userId = req.token && req.token.data && req.token.data._id;
        await currencyService.predict(code, userId, predictionHelper.PREDICTION.INCREASE);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/:code/predict-decrease', isAuthenticated, async (req, res) => {
    try {
        const code = req.params.code;
        const userId = req.token && req.token.data && req.token.data._id;
        await currencyService.predict(code, userId, predictionHelper.PREDICTION.DECREASE);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/:code/clear-prediction', isAuthenticated, async (req, res) => {
    try {
        const code = req.params.code;
        const userId = req.token && req.token.data && req.token.data._id;
        await currencyService.clearPrediction(code, userId);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/:code/intraday', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await currencyService.getIntraday(code);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/:code/last-week', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await currencyService.getLastWeek(code);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/:code/last-month', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await currencyService.getLastMonth(code);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/:code/last-100', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await currencyService.getLast100(code);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/:code/full', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await currencyService.getLastFull(code);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'InvalidCurrencyCode') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

/*
router.post('/:id/comment', isAuthenticated, async (req, res) => {
    try {
        const currencyId = req.params.id;
        const userId = req.token && req.token.data && req.token.data._id;
        const body = req.body.body;
        await currencyService.postComment(currencyId, userId, body);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'CurrencyNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'ValidationError') {
            const causes = [];
            for (const field in err.errors) {
                if (err.errors[field].message === 'InvalidBody') {
                    causes.push(errors.INVALID_BODY());
                } else {
                    causes.push(errors.UNKNOWN_VALIDATION_ERROR(err.errors[field]));
                }
            }
            res.status(400).send(errors.VALIDATION_ERROR(causes));
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.get('/:id/comment/:commentId', async (req, res) => {
    try {
        const currencyId = req.params.id;
        const commentId = req.params.commentId;
        const comment = await currencykService.getComment(currencyId, commentId);
        res.status(200).send(comment);
    } catch (err) {
        if (err.name === 'CommentNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'CurrencyNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/:id/comment/:commentId', isAuthenticated, async (req, res) => {
    try {
        const currencyId = req.params.id;
        const authorId = req.token && req.token.data && req.token.data._id;
        const commentId = req.params.commentId;
        const newBody = req.body.body;
        await currencyService.editComment(currencyId, authorId, commentId, newBody);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'CurrencyNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'CommentNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'ValidationError') {
            const causes = [];
            for (const field in err.errors) {
                if (err.errors[field].message === 'InvalidBody') {
                    causes.push(errors.INVALID_BODY());
                } else {
                    causes.push(errors.UNKNOWN_VALIDATION_ERROR(err.errors[field]));
                }
            }
            res.status(400).send(errors.VALIDATION_ERROR(causes));
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.delete('/:id/comment/:commentId', isAuthenticated, async (req, res) => {
    try {
        const currencyId = req.params.id;
        const commentId = req.params.commentId;
        const userId = req.token && req.token.data && req.token.data._id;
        await currencyService.deleteComment(currencyId, commentId, userId);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'CurrencykNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'CommentNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});
*/

module.exports = router;
