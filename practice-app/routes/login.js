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
    
    const q = Users.findOne({'username': user.username, 'password': user.password})
    q.then(()=> {
        res.redirect('/logged_in')
    }).catch(err => {
        console.error(err)
        res.status(400).send(err);
    })
    
})
  
module.exports = router;
