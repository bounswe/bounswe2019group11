const express = require('express');
const articleService = require('../services/article');
const errors = require('../helpers/errors');
const isAuthenticated = require('../middlewares/isAuthenticated');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await articleService.getAll();
        res.status(200).json(response);

    } catch (err) {
        res.status(500).send(errors.INTERNAL_ERROR(err));
    }
});

router.get('/:id', async (req, res) => {
    try {
        const ID = req.params.id;
        const response = await articleService.getById(ID);
        res.status(200).send(response);
    } catch (err) {
        if (err.name === 'ArticleNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/', isAuthenticated, async (req, res) => {
    try {
        const {title, body} = req.body;
        const authorId = req.token.data._id;
        const response = await articleService.create(title, body, authorId);
        res.status(200).send(response);
    } catch (err) {
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

router.get('/user/:userId',async (req,res)=>{
    try{
        const Id = req.params.userId;
        const response = await articleService.getByUserId(Id);
        res.status(200).json(response);
    }catch (e) {
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

module.exports = router;
