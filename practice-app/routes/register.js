const express = require('express');
const router = express.Router();

const Users = require('../models/users')

router.get('/', (req, res) => {
  res.render("register")
})

router.post('/', (req, res) => {
    const user = { ...req.body};

    user.password = Buffer.from(user.password).toString('base64');

    Users.create(user).then(() => {
        delete user.password;
        res.send(user);
    }).catch(err => {
        console.error(err);
        res.status(400).send(err);
    })
})
  
module.exports = router;