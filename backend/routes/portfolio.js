const express = require('express');
const router = express.Router();
const portfolioService = require('../services/portfolio');

router.get('/',async (req,res)=>{
    try{
        const response = await portfolioService.getAll();
        res.status(200).json(response);


    }catch (e) {
        res.status(503)
    }
});

router.get('/:id',async (req,res)=>{
    try{
        const Id = req.params.id;
        const response = await portfolioService.getById(Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503)
    }
});

router.post('/:id/stock',async (req,res) => {

    try{
        const Id = req.params.id;
        const theStock = {...req.body};
        const response = await portfolioService.addStock(theStock,Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e)
    }

});

router.delete('/:id/stock',async (req,res) => {

    try{
        const Id = req.params.id;
        const theStock = {...req.body};
        const response = await portfolioService.removeStock(theStock,Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e)
    }

});

router.post('/',async (req,res) => {

    try{
        const thePortfolio = {...req.body};
        const response = await portfolioService.create(thePortfolio);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e)
    }

});

router.get('/user/:userId',async (req,res)=>{
    try{
        const Id = req.params.userId;
        const response = await portfolioService.getByUserId(Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503)
    }
});


module.exports = router;