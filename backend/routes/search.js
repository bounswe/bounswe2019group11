const express = require('express');
const searchService = require('../services/search');
const errors = require('../helpers/errors');


const router = express.Router();

router.get('/:term', async (req, res) => {
    try {
        const term = req.params.term;
        const response = await searchService.search(term);
        res.status(200).send(response);
    } catch (err) {
        res.status(500).send(errors.INTERNAL_ERROR(err));
    }
});

module.exports = router;
