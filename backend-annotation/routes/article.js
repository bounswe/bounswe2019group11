const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const annotationService = require('../services/annotations');

router.post('/',isAuthenticated,async (req,res)=>{
    try{
        console.log(req.body);
        const {type,body,target} = req.body;
        const authorId = req.token && req.token.data && req.token.data._id;
        const annotation = await annotationService.createAnnotation(type,authorId,Date.now(),body,target);
        res.status(200).json(annotation);
    }catch (e) {
        console.log(e);
        res.sendStatus(503);
    }
});
module.exports = router;
