const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('exchange_rate');
});

module.exports = router;
