const express = require('express');
const articleService = require('../services/article');
 
const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const response = await articleService.getAll();
        res.status(200).json(response);

    }catch (e) {
        res.status(503)
    }
});

router.get('/:id',async (req,res)=>{
    try{
        const ID = req.params.id;
        const response = await articleService.getById(ID);
        res.status(200).json(response);
    }catch (e) {
        res.status(503)
    }
});

router.post('/',async (req,res) => {
    try{
        const newArticle = {...req.body};
        const response = await articleService.create(newArticle);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e)
    }

});

module.exports = router;
