const express = require('express');
const userService = require('../services/user');
const articleService = require('../services/article');
const portfolioService = require('../services/portfolio');
const investmentsService = require('../services/investments');
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

const myProfileDataTransferObject = (user,articles,portfolios,following,followingPending,followers,followerPending) => {
    return {
        privacy: 'private',
        name:user.name,
        surname:user.surname,
        location: user.location,
        articles: articles,
        portfolios: portfolios,
        following:following,
        followingPending:followingPending,
        followers:followers,
        followerPending:followerPending

    };
};

const privateProfileDataTransferObject = (user,articles,inInMyNetwork) => {
    return {
        privacy: 'private',
        name:user.name,
        surname:user.surname,
        location: user.location,
        articles: articles,
        isInMyNetwork: inInMyNetwork,
        isMe:false
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
        isInMyNetwork: inInMyNetwork,
        isMe:false
    };
};

router.get('/other/:id', async (req, res) => {
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
            if(id.toString() === userId){
                res.status(200).json({isMe:true});
            }else{
                const user = await userService.getById(id);
                const articles = await articleService.getByUserId(id);
                const portfolios = await portfolioService.getByUserId(id);
                const _isInMyNetwork = isInMyNetwork(mainUser,user);
                if(user.privacy === 'public' || _isInMyNetwork === "true"){

                    res.status(200).send(publicProfileDataTransferObject(user,articles,portfolios,_isInMyNetwork));
                }else{
                    res.status(200).send(privateProfileDataTransferObject(user,articles,_isInMyNetwork));
                }
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

router.get('/myprofile',isAuthenticated, async (req, res) => {
    try {
        const userId =  req.token && req.token.data && req.token.data._id;
        const articles = await articleService.getByUserId(userId);
        const portfolios = await portfolioService.getByUserId(userId);
        userService.getSocialNetworkById(userId).then(user=>{
            const followingPending = user.following.filter(elm => elm.isAccepted === false).map(elm => elm.userId);
            const following = user.following.filter(elm => elm.isAccepted === true).map(elm => elm.userId);
            const followerPending = user.followers.filter(elm => elm.isAccepted === false).map(elm => elm.userId);
            const follower = user.followers.filter(elm => elm.isAccepted === true).map(elm => elm.userId);
            res.status(200).json(myProfileDataTransferObject(user,articles,portfolios,following,followingPending,follower,followerPending));
        });

    }catch (err) {
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
        }else if(err.name === 'FollowedAlready'){
            res.status(400).send(errors.ALREADY_FOLLOWED(err));
        }
        else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/:id/unfollow',isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const userId =  req.token && req.token.data && req.token.data._id;
        const user = await userService.getById(userId);
        const userToBeAccepted = await userService.getById(id);
        res.status(200).json({msg:await user.unfollow(userToBeAccepted)});

    } catch (err) {
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/:id/accept',isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const userId =  req.token && req.token.data && req.token.data._id;
        const user = await userService.getById(userId);
        const userToBeAccepted = await userService.getById(id);
        res.status(200).json({msg:await user.accept(userToBeAccepted)});

    } catch (err) {
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

router.post('/:id/decline',isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const userId =  req.token && req.token.data && req.token.data._id;
        const user = await userService.getById(userId);
        const userToBeDeclined = await userService.getById(id);
        res.status(200).json({msg:await user.decline(userToBeDeclined)});

    } catch (err) {
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

module.exports = router;