const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Users = require('../models/users')

router.get('/', (req, res) => {
  res.render("logged_in")
})
  
module.exports = router;
