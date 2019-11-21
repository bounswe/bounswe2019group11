const express = require('express');
const userService = require('../services/user');
const articleService = require('../services/article');
const portfolioService = require('../services/portfolio');
const errors = require('../helpers/errors');
const router = express.Router();

const privateProfileDataTransferObject = (user,articles) => {
    return {
        privacy: 'private',
        name:user.name,
        surname:user.surname,
        location: user.location,
        articles: articles
    };
};

const publicProfileDataTransferObject = (user,articles,portfolios) => {
    return {
        privacy: 'public',
        name:user.name,
        surname:user.surname,
        location: user.location,
        articles: articles,
        portfolios: portfolios
    };
};

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.getById(id);
        const articles = await articleService.getByUserId(id);
        const portfolios = await portfolioService.getByUserId(id);
        if(user.privacy === 'public'){
            res.status(200).send(publicProfileDataTransferObject(user,articles,portfolios));
        }else{
            res.status(200).send(privateProfileDataTransferObject(user,articles));
        }

    } catch (err) {
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/:id/follow', async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.body.id;
        const user = await userService.getById(userId);
        const userToBeFollowed = await userService.getById(id);
        res.status(200).json({msg:await user.follow(userToBeFollowed)});

    } catch (err) {
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});



module.exports = router;