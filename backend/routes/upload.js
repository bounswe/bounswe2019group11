const express = require('express');
const router = express.Router();
const multer = require('multer');
const profilePictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/profilePictures');
    },
    filename: (req, file, cb) => {
        const name = file.originalname;
        cb(null, name); //req.userData._id);
    }
});

const uploadPP = multer({
    profilePictureStorage
});

router.post('/avatar',uploadPP.single('avatar'),async (req,res)=>{
    const path = req.file.path;
    const mimetype = req.file.mimetype;
    console.log(path);
    console.log(mimetype);
});
module.exports =  router;