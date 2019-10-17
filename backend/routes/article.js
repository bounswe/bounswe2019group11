const express = require('express');
const articleService = require('../services/article');
const errors = require('../helpers/errors');

const router = express.Router();

router.get('/', async (req, res) => {
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

router.get('/:id',async (req,res)=>{
    try{
        const ID = req.params.id;
        const response = await articleService.getById(ID);
        res.status(200).json(response);
    }catch (e) {
        res.status(503)
    }
});

module.exports = router;
