const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const annotationService = require('../services/annotations');

router.get('/article/:articleId',async (req,res)=>{
   try{
       const articleId = req.params.articleId;
        const annotations =await annotationService.getAnnotationsByArticleId(articleId);
        res.status(200).json(annotations);
   }catch (e) {
       console.log(e);
       res.sendStatus(503);
   }
});

router.post('/',isAuthenticated,async (req,res)=>{
    try{
        const authorId = req.token && req.token.data && req.token.data._id;
        const {type,body,target} = req.body;
        body['creator'] = authorId;
        const annotation = await annotationService.createAnnotation(type,authorId,Date.now(),body,target);
        res.status(200).json(annotation);
    }catch (e) {
        console.log(e);
        res.sendStatus(503);
    }
});

router.post('/:annotationId',isAuthenticated,async (req,res)=>{
    try{
        const authorId = req.token && req.token.data && req.token.data._id;
        const body = req.body;
        body['created'] = Date.now();
        body['creator'] = authorId;
        const annotationId = req.params.annotationId;
        const annotation = await annotationService.addBody(annotationId,body);
        res.status(200).json(annotation);
    }catch (e) {
        console.log(e);
        res.sendStatus(503);
    }
});

module.exports = router;
