const express = require('express');
const router = express.Router();
const investmentsService = require('../services/investments');

router.get('/',async (req,res)=>{
    try{
        const response = await investmentsService.getAll();
        res.status(200).json(response);

    }catch (e) {
        res.status(503)
    }
});

router.get('/:id',async (req,res)=>{
    try{
        const Id = req.params.id;
        const response = await investmentsService.getById(Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503)
    }
});

router.post('/:id/stock',async (req,res) => {

    try{
        const Id = req.params.id;
        const {theStock, amount} = req.body;
        const response = await investmentsService.addStock(theStock,amount, Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e)
    }

});

router.delete('/:id/stock',async (req,res) => {

    try{
        const Id = req.params.id;
        const theStock = {...req.body};
        const response = await investmentsService.removeStock(theStock,Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e)
    }

});

router.post('/',async (req,res) => {

    try{
        const myInvestments = {...req.body};
        const response = await investmentsService.create(myInvestments);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e)
    }

});

router.get('/user/:userId',async (req,res)=>{
    try{
        const Id = req.params.userId;
        const response = await investmentsService.getByUserId(Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503)
    }
});


module.exports = router;