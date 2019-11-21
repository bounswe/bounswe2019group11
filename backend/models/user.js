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
    following: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }],
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        }],

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
userSchema.methods.follow =async function(userId){
    if(this.following.indexOf(userId) === -1){
        this.following.push(userId);
    }

    return await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
