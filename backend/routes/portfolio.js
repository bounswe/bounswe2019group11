const express = require('express');
const router = express.Router();
const portfolioService = require('../services/portfolio');

router.get('/',async (req,res)=>{
    try{
        const response = await portfolioService.getAll();
        res.status(200).json(response);


    }catch (e) {
        res.sendStatus(503);
    }
});

router.get('/:id',async (req,res)=>{
    try{
        const Id = req.params.id;
        const response = await portfolioService.getById(Id);
        res.status(200).json(response);
    }catch (e) {
        res.sendStatus(503);
    }
});

router.post('/:id/stock',async (req,res) => {

    try{
        const Id = req.params.id;
        const theStock = {...req.body};
        const response = await portfolioService.addStock(theStock,Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e);
    }

});

router.delete('/:id/stock',async (req,res) => {

    try{
        const Id = req.params.id;
        const theStock = {...req.body};
        const response = await portfolioService.removeStock(theStock,Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e);
    }

});

router.post('/:id/tradingEquipment',async (req,res) => {

    try{
        const Id = req.params.id;
        const theTradingEquipment = {...req.body};
        const response = await portfolioService.addTradingEquipment(theTradingEquipment,Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e);
    }

});

router.delete('/:id/tradingEquipment',async (req,res) => {

    try{
        const Id = req.params.id;
        const theTradingEquipment = {...req.body};
        const response = await portfolioService.removeTradingEquipment(theTradingEquipment,Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e);
    }

});

router.post('/:id/currency',async (req,res) => {

    try{
        const Id = req.params.id;
        const theCurrency = {...req.body};
        const response = await portfolioService.addCurrency(theCurrency,Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e);
    }

});

router.delete('/:id/currency',async (req,res) => {

    try{
        const Id = req.params.id;
        const theCurrency = {...req.body};
        const response = await portfolioService.removeCurrency(theCurrency,Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e);
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
        res.sendStatus(503);
    }
});


module.exports = router;
