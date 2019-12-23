const express = require('express');
const router = express.Router();
const investmentsService = require('../services/investments');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.get('/',isAuthenticated,async (req,res)=>{
    try{
        const response = await investmentsService.getAll();
        res.status(200).json(response);

    }catch (e) {
        res.sendStatus(503);
    }
});

router.get('/:id',isAuthenticated,async (req,res)=>{
    try{
        const Id = req.params.id;
        const response = await investmentsService.getById(Id);
        res.status(200).json(response);
    }catch (e) {
        res.sendStatus(503);
    }
});

router.post('/:id/stock',isAuthenticated, async (req,res) => {

    try{
        const Id = req.params.id;
        const {stock, amount} = req.body;
        const response = await investmentsService.addStock(stock,amount, Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e);
    }

});

router.put('/:id/stock',isAuthenticated,async (req,res) => {

    try{
        const Id = req.params.id;
        const {stock, amount} = req.body;
        const response = await investmentsService.removeStock(stock, amount,Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e);
    }

});

router.post('/:id/currency',isAuthenticated,async (req,res) => {

    try{
        const Id = req.params.id;
        const {currency, amount} = req.body;
        const response = await investmentsService.addCurrency(currency,amount, Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e);
    }

});

router.put('/:id/currency',isAuthenticated,async (req,res) => {

    try{
        const Id = req.params.id;
        const {currency, amount} = req.body;
        const response = await investmentsService.removeCurrency(currency, amount,Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e);
    }

});
 
router.put('/:id/exchangeCC',isAuthenticated,async (req,res) => {

    try{
        const Id = req.params.id;
        const {fromCurrency, toCurrency, amount} = req.body;
        const response = await investmentsService.exchangeCurrency(fromCurrency, toCurrency, amount,Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e);
    }

});

router.put('/:id/exchangeSS',isAuthenticated,async (req,res) => {

    try{
        const Id = req.params.id;
        const {fromStock, toStock, amount} = req.body;
        const response = await investmentsService.exchangeStock(fromStock, toStock, amount,Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e);
    }

});

router.post('/',isAuthenticated,async (req,res) => {

    try{
        const userId = req.token && req.token.data && req.token.data._id;
        const myInvestments = {...req.body};
        const response = await investmentsService.create(myInvestments,userId);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e);
    }

});

router.get('/user/:userId',isAuthenticated,async (req,res)=>{
    try{
        const Id = req.params.userId;
        const response = await investmentsService.getByUserId(Id);
        res.status(200).json(response);
    }catch (e) {
        res.sendStatus(503);
    }
});


module.exports = router;