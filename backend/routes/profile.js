const express = require('express');
const userService = require('../services/user');
const articleService = require('../services/article');
const portfolioService = require('../services/portfolio');
const isAuthenticated = require('../middlewares/isAuthenticated');
const errors = require('../helpers/errors');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const router = express.Router();

function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
};

const isInMyNetwork = (user,userToBeChecked) =>{
    const index = user.following.findIndex(elm => elm.userId.toString() === userToBeChecked._id.toString());
    const following = user.following[index];
    if(following){
        if(following.isAccepted){
            return "true";
        }else{
            return "pending";
        }
    }else{
        return "false";
    }

};

const privateProfileDataTransferObject = (user,articles,inInMyNetwork) => {
    return {
        privacy: 'private',
        name:user.name,
        surname:user.surname,
        location: user.location,
        articles: articles,
        isInMyNetwork: inInMyNetwork
    };
};

const publicProfileDataTransferObject = (user,articles,portfolios,inInMyNetwork) => {
    return {
        privacy: 'public',
        name:user.name,
        surname:user.surname,
        location: user.location,
        articles: articles,
        portfolios: portfolios,
        isInMyNetwork: inInMyNetwork
    };
};

router.get('/:id', async (req, res) => {
    try {
        const token = getTokenFromHeader(req);
        if (token) {
            let payload = null;
            try {
                payload = jwt.decode(token, process.env.JWT_TOKEN_SECRET);
            } catch (e) {
                return res.status(401).send(errors.INVALID_TOKEN());
            }
            if (payload.exp < moment.unix()) {
                return res.status(401).send(errors.EXPIRED_TOKEN());
            }
            req.token = {
                data: payload
            };
            const userId = req.token && req.token.data && req.token.data._id;
            const mainUser = await userService.getById(userId);
            const id = req.params.id;
            const user = await userService.getById(id);
            const articles = await articleService.getByUserId(id);
            const portfolios = await portfolioService.getByUserId(id);

            if(user.privacy === 'public'){
                res.status(200).send(publicProfileDataTransferObject(user,articles,portfolios,isInMyNetwork(mainUser,user)));
            }else{
                res.status(200).send(privateProfileDataTransferObject(user,articles,isInMyNetwork(mainUser,user)));
            }
        }else{
            const id = req.params.id;
            const user = await userService.getById(id);
            const articles = await articleService.getByUserId(id);
            const portfolios = await portfolioService.getByUserId(id);
            if(user.privacy === 'public'){
                res.status(200).send(publicProfileDataTransferObject(user,articles,portfolios));
            }else{
                res.status(200).send(privateProfileDataTransferObject(user,articles));
            }
        }

    } catch (err) {
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/:id/follow',isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const userId =  req.token && req.token.data && req.token.data._id;
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