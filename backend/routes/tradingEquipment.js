const express = require('express');
const router = express.Router();
const tradingEquipmentService = require('../services/tradingEquipment');


router.get('/',async (req,res)=>{
    try{
        const type = req.query.type;
        if(type == 'stock'){
            const response = await tradingEquipmentService.getStockAll();
            res.status(200).json(response);
        }else if(type == 'currency'){

        }else if (type == 'crypto'){

        }else{
            const response = await tradingEquipmentService.getAll();
            res.status(200).json(response);
        }

    }catch (e) {
        res.status(503)
    }
});

router.get('/:id',async (req,res)=>{
    try{
        const Id = req.params.id;
        const response = await tradingEquipmentService.getById(Id);
        res.status(200).json(response);
    }catch (e) {
        res.status(503)
    }
});

router.get('/stock',async (req,res)=>{
    try{
        const response = await tradingEquipmentService.getStockAll();
        res.status(200).json(response);
    }catch (e) {
        res.status(503)
    }
});



router.post('/stock',async (req,res) => {

    try{
        const theStock = {...req.body};
        const response = await tradingEquipmentService.createStock(theStock);
        res.status(200).json(response);
    }catch (e) {
        res.status(503).json(e)
    }


});

module.exports = router;