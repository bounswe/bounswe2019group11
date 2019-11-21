const express = require('express');
const userService = require('../services/user');
const errors = require('../helpers/errors');
const router = express.Router();

const profileDataTransferObject = (user) => {
    return {
      name:user.name,
      surname:user.surname,
      location: user.location
    };
};

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.getById(id);
        res.status(200).send(profileDataTransferObject(user));

    } catch (err) {
        if (err.name === 'UserNotFound') {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
});

module.exports = router;