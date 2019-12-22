const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const multer = require('multer');
const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/profilePictures');
    },
    filename: (req,file, cb) => {

        const userId = req.token && req.token.data && req.token.data._id;
        console.log(userId);
        const name = userId+".png";
        console.log(name);

        console.log(file.path)
        cb(null, name); //req.userData._id);
    }
});

const uploadPP = multer({storage:profilePictureStorage});


router.post('/avatar',isAuthenticated, uploadPP.single('avatar'),async (req,res)=>{
    const path = req.file.path;
    const mimetype = req.file.mimetype;
    console.log(path);
    console.log(mimetype);
});
module.exports =  router;