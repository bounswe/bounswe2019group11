const LostPasswordToken = require('../models/lostPasswordToken');
const emailService = require('./email');
const User = require('../models/user');
const errors = require('../helpers/errors');
const mongoose = require('mongoose');

async function sendLostPasswordMail(email, lostPasswordToken) {
    // TODO link should be updated once frontend implements this page
    const text = `Hi ${email}\nYou can reset your password by 
    following the instructions at the localhost:3000/profile/lost-password/reset/${lostPasswordToken}`;
    await emailService.sendMail(email, 'Papel - Lost Password', text);
}

module.exports.getAll = async () => {
    return await User.find();
};

module.exports.getById = async (_id) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw errors.USER_NOT_FOUND();
    }
    const user = await User.findOne({_id})
        .populate({
            path:'following.userId',
            model:'User',
            select: 'id name surname email'
        })
        .populate({
            path:'followers.userId',
            model:'User',
            select: 'id name surname email'
        })
        .exec();
    if (!user) {
        throw errors.USER_NOT_FOUND();
    }
    return user;
};

module.exports.sendLostPasswordEmail = async (email) => {
    const user = await User.findOne({email});
    if (!user) {
        throw errors.USER_NOT_FOUND();
    }
    let lostPasswordToken = await LostPasswordToken.findOne({_userId: user._id});
    if (!lostPasswordToken) {
        lostPasswordToken = await user.generateLostPasswordToken();
    }
    await sendLostPasswordMail(email, lostPasswordToken.token);
};

module.exports.resetPassword = async (token, password) => {
    const lostPasswordToken = await LostPasswordToken.findOne({token});
    if (!lostPasswordToken) {
        throw errors.INVALID_LOST_PASSWORD_TOKEN();
    }
    const user = await User.findOne({_id: lostPasswordToken._userId});
    if (!user) {
        throw errors.USER_NOT_FOUND();
    }
    if (!(password.length > 5)) {
        throw errors.INVALID_PASSWORD();
    }
    user.password = password;
    await user.save();
    await LostPasswordToken.deleteOne({token});
};

module.exports.getSocialNetworkById= async (_id) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw errors.USER_NOT_FOUND();
    }
     return  User.findOne({_id})
        .populate({
            path:'following.userId',
            model:'User',
            select: 'id name surname email'
        })
         .populate({
             path:'followers.userId',
             model:'User',
             select: 'id name surname email'
         })
        .exec();
};
module.exports.updatePrivacy = async (userId, privacy) => {
    if (!(mongoose.Types.ObjectId.isValid(userId))) {
        throw errors.USER_NOT_FOUND();
    }
    if (!(privacy === "public" || privacy === "private")) {
        throw errors.INVALID_PRIVACY_OPTION();
    }
    let userUpdate = await User.findOne({_id:userId});
    if (!userUpdate) {
        throw errors.USER_NOT_FOUND();
    }
    userUpdate.privacy = privacy;
    return await userUpdate.save();
};
