const express = require('express');
const eventService = require('../services/event');
const errors = require('../helpers/errors');
const isAuthenticated = require('../middlewares/isAuthenticated');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await eventService.getAll();
        res.status(200).json(response);

    } catch (e) {
        res.status(500).send(errors.INTERNAL_ERROR(err));
    }
});

router.get('/:id', async (req, res) => {
    try {
        const ID = req.params.id;
        const response = await eventService.getById(ID);
        res.status(200).json(response);
    } catch (err) {
        if (err.name === 'EventNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/', async (req, res) => {
    try {
        const newEvent = {...req.body};
        const response = await eventService.create(newEvent);
        res.status(200).json(response);
    }  catch (err) {
        if (err.name === 'ValidationError') {
            const causes = [];
            for (const field in err.errors) {
                switch (err.errors[field].message) {
                    case 'InvalidTitle':
                        causes.push(errors.INVALID_TITLE());
                        break;
                    case 'InvalidBody':
                        causes.push(errors.INVALID_BODY());
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
router.post('/:id/comment', isAuthenticated, async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.token && req.token.data && req.token.data._id;
        const body = req.body.body;
        await eventService.postComment(eventId, userId, body);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'EventNotFound') {
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
        const eventId = req.params.id;
        const commentId = req.params.commentId;
        const comment = await eventService.getComment(eventId, commentId);
        res.status(200).send(comment);
    } catch (err) {
        if (err.name === 'CommentNotFound') {
            res.status(400).send(err);
        } else if (err.name === 'EventNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/:id/comment/:commentId', isAuthenticated, async (req, res) => {
    try {
        const eventId = req.params.id;
        const authorId = req.token && req.token.data && req.token.data._id;
        const commentId = req.params.commentId;
        const newBody = req.body.body;
        await eventService.editComment(eventId, authorId, commentId, newBody);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'EventNotFound') {
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
        const eventId = req.params.id;
        const commentId = req.params.commentId;
        const userId = req.token && req.token.data && req.token.data._id;
        await eventService.deleteComment(eventId, commentId, userId);
        res.sendStatus(200);
    } catch (err) {
        if (err.name === 'EventNotFound') {
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

module.exports = router;
