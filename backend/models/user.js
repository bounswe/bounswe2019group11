const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator').isEmail;
const authHelper = require('../helpers/auth');
const VerificationToken = require('./verificationToken');
const crypto = require('crypto');
const LostPasswordToken = require('./lostPasswordToken');

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

});

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
    if(this.following.indexOf(userIdToBeFollowed) === -1){
        if(userToBeFollowed.privacy === 'public'){
            this.following.push({userId:userIdToBeFollowed, isAccepted:true});
            userToBeFollowed.followers.push({userId:this._id,isAccepted:true});
            await userToBeFollowed.save();
            await this.save();
            return  userToBeFollowed.name + " "+ userToBeFollowed.surname + " successfully followed";
        }else{
            this.following.push({userId:userIdToBeFollowed, isAccepted:false});
            userToBeFollowed.followers.push({userId:this._id,isAccepted:false});
            await userToBeFollowed.save();
            await this.save();
            return "Follow request has been sent to " + userToBeFollowed.name + " "+ userToBeFollowed.surname;
        }

    }

};

const User = mongoose.model('User', userSchema);

module.exports = User;
