const express = require('express');
const userService = require('../services/user');
const errors = require('../helpers/errors');
const router = express.Router();

const privateProfileDataTransferObject = (user) => {
    return {
        privacy: 'private',
        name:user.name,
        surname:user.surname,
        location: user.location
    };
};

const publicProfileDataTransferObject = (user) => {
    return {
        privacy: 'public',
        name:user.name,
        surname:user.surname,
        location: user.location
    };
};

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.getById(id);
        console.log(user.profileSettings.privacy);
        if(user.profileSettings.privacy === 'public'){
            res.status(200).send(publicProfileDataTransferObject(user));
        }else{
            res.status(200).send(privateProfileDataTransferObject(user));
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
        res.status(200).send(await user.follow(userToBeFollowed));

    } catch (err) {
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});



module.exports = router;