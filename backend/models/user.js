const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator').isEmail;
const authHelper = require('../helpers/auth');
const VerificationToken = require('./verificationToken');
const crypto = require('crypto');
const LostPasswordToken = require('./lostPasswordToken');
const errors = require('../helpers/errors');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'InvalidName',
        trim: true,
    },
    surname: {
        type: String,
        required: 'InvalidSurname',
        trim: true,
    },
    email: {
        type: String,
        required: 'InvalidEmail',
        unique: true,
        lowercase: true,
        validate: {
            validator: (v) => {
                return isEmail(v);
            },
            message: () => 'InvalidEmail',
        },
    },
    password: {
        type: String,
        select: false,
        required: 'InvalidPassword',
        validate: {
            validator: (v) => {
                return v.length > 5;
            },
            message: () => 'InvalidPassword',
        }
    },
    idNumber: {
        type: String,
        validate: {
            validator: authHelper.validateIdNumber,
            message: () => 'InvalidIdNumber',
        }
    },
    iban: {
        type: String,
        validate: {
            validator: authHelper.validateIban,
            message: () => 'InvalidIban',
        }
    },
    role: {
        type: String,
        enum: [authHelper.ROLES.BASIC, authHelper.ROLES.TRADER, authHelper.ROLES.ADMIN],
        default: authHelper.ROLES.BASIC,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    location: {
        latitude: {
            type: Number,
            required: 'InvalidLatitude',
        },
        longitude: {
            type: Number,
            required: 'InvalidLongitude',
        },
    },
    googleUserId: {
        type: String,
        default: undefined,
        select: false,
    },
    following: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId, ref: 'User'
            },
            isAccepted:{ // This controls follow request is accepted or not
                type: Boolean,
                default: false
            },
            _id:false

        }],
    followers:[
        {   
            userId: {
                type: mongoose.Schema.Types.ObjectId, ref: 'User'
            },
            isAccepted:{ // This controls incoming follow request is accepted by the user or not
                type: Boolean,
                default: false
            },
            _id:false

        }],
    privacy:{
        type: String,
        enum: ['public','private'],
        default: 'public'
    },
    totalPredictionCount: {
        type: Number,
        default: 0,
    },
    successfulPredictionCount: {
        type: Number,
        default: 0,
    },
    money: {
        type: Number,
        default: 0,
        select: false,
    }
});

userSchema.index({name: 'text', surname: 'text'});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    return next();
});

userSchema.methods.generateVerificationToken = async function() {
  const token = crypto.randomBytes(32).toString('hex');
  return await VerificationToken.create({
      _userId: this._id,
      token,
  });
};

userSchema.methods.generateLostPasswordToken = async function () {
    const token = crypto.randomBytes(32).toString('hex');
    return await LostPasswordToken.create({
        _userId: this._id,
        token,
    });
};
userSchema.methods.follow =async function(userToBeFollowed){
    const userIdToBeFollowed = userToBeFollowed._id;
    console.log(this.following);
    const index = this.following.findIndex(elm => elm.userId._id.toString() === userIdToBeFollowed.toString());
    if(index === -1){
        if(userToBeFollowed.privacy === 'public'){
            this.following.push({userId:userIdToBeFollowed, isAccepted:true});
            userToBeFollowed.followers.push({userId:this._id,isAccepted:true});
            await userToBeFollowed.save();
            await this.save();
            return  {msg:userToBeFollowed.name + " "+ userToBeFollowed.surname + " successfully followed",status:"follow"};
        }else{
            this.following.push({userId:userIdToBeFollowed, isAccepted:false});
            userToBeFollowed.followers.push({userId:this._id,isAccepted:false});
            await userToBeFollowed.save();
            await this.save();
            return {msg:"Follow request has been sent to " + userToBeFollowed.name + " "+ userToBeFollowed.surname,status:"request"};
        }

    }else{
        throw errors.ALREADY_FOLLOWED();
    }

};

userSchema.methods.unfollow = async function (userToBeUnfollowed) {
    const userIdToBeUnfollowed = userToBeUnfollowed._id;
    //console.log(this.following)
    console.log(userToBeUnfollowed.followers);
    const index = this.following.findIndex(elm => elm.userId._id.toString() === userIdToBeUnfollowed.toString());
    if(index !== -1) {
        this.following.splice(index, 1);
        const index2 = userToBeUnfollowed.followers.findIndex(elm => elm.userId._id.toString() === this._id.toString());
        userToBeUnfollowed.followers.splice(index2, 1);
        await this.save();
        await userToBeUnfollowed.save();
        return {msg: userToBeUnfollowed.name +" "+ userToBeUnfollowed.surname +" has been successfully unfollowed",status:"unfollow"};
    }else{
        throw errors.USER_NOT_FOUND();
    }
};

userSchema.methods.accept = async function (userToBeAccepted) {
    const userIdToBeAccepted = userToBeAccepted._id;
    const index = this.followers.findIndex(elm => elm.userId._id.toString() === userIdToBeAccepted.toString());
    if(index !== -1){
        this.followers[index]['isAccepted'] = true;
        const index2 = userToBeAccepted.following.findIndex(elm => elm.userId._id.toString() === this._id.toString());
        userToBeAccepted.following[index2]['isAccepted'] = true;
        await this.save();
        await userToBeAccepted.save();
        return {msg:"Follow request from "+userToBeAccepted.name +" "+ userToBeAccepted.surname + " accepted",status:"accept"};
    }else{
        throw errors.USER_NOT_FOUND();
    }

};

userSchema.methods.decline = async function (userToBeDeclined) {
    const userIdToBeDeclined = userToBeDeclined._id;
    const index = this.followers.findIndex(elm => elm.userId._id.toString() === userIdToBeDeclined.toString());
    if(index !== -1){
        this.followers.splice(index,1);
        console.log(this.followers);
        const index2 = userToBeDeclined.following.findIndex(elm => elm.userId._id.toString() === this._id.toString());
        userToBeDeclined.following.splice(index2,1);
        await this.save();
        await userToBeDeclined.save();
        return {msg:"Follow request from "+userToBeDeclined.name +" "+ userToBeDeclined.surname + " declined",status:"decline"};
    }else{
        throw errors.USER_NOT_FOUND();
    }

};

const User = mongoose.model('User', userSchema);

module.exports = User;
