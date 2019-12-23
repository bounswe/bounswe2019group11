const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const multer = require('multer');
const path = require('path');
const dir = path.join(__dirname, '../uploads');
const userService = require('../services/user');
const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/profilePictures');
    },
    filename: (req,file, cb) => {
        const userId = req.token && req.token.data && req.token.data._id;

        const name = userId+".png";
        cb(null, name); //req.userData._id);
    }
});

const uploadPP = multer({storage:profilePictureStorage});

router.get('/avatar/:userId',async (req,res)=>{
    const userId = req.params.userId;
    const filePath = path.join(dir,'profilePictures/'+userId+".png");
    res.status(200).sendFile(filePath);
});

router.post('/avatar',isAuthenticated, uploadPP.single('avatar'),async (req,res)=>{
    const userId = req.token && req.token.data && req.token.data._id;
    const imgUri = process.env.BACKEND_URL + "/upload/avatar/" +  userId;
    const user = await userService.setProfileImage(userId,imgUri);

    res.status(200).json({user:user,imgUri:imgUri,msg:"File uploaded successfully"});
});
module.exports =  router;