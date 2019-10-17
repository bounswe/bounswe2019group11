const express = require('express');
const request = require('request');

const router = express.Router();

router.get('/api',(req,res)=>{
    var q = req.query.q;
    var from = req.query.from;
    var options = {'url':process.env.NEWS_API_URL,'qs':{q:q,from:from}};
    request(options,(err,response,body)=>{

        if(err){
            console.log(err)
            res.status(400).json({msg:"Error occured",error:err})
        }
        else if(response.statusCode != 200){

            res.status(400).json({msg:"Error occured at Third-party API side",error:body})
        }
        else{
            res.status(200).json(body)
        }
    })
})
router.get('/',(req,res)=>{
    res.render('news_search');
})
module.exports = router;
