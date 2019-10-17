const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Users = require('../models/users')

router.get('/', (req, res) => {
  res.render("login")
})

router.post('/', (req, res) => {
    const user = { ...req.body};

    user.password = Buffer.from(user.password).toString('base64');
    
    Users.findOne({'username': user.username, 'password': user.password}).then((result)=> {
        if (result) {
            res.redirect('/logged_in');
        } else {
            res.status(400).send({
                'error':  'Wrong credentials!'
            });
        }
    }).catch(err => {
        console.error(err);
        res.status(400).send(err);
    })
    
})
  
module.exports = router;
