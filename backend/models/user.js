const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator').isEmail;
const jwt = require('jsonwebtoken');
const authHelper = require('../helpers/auth');
const VerificationToken = require('./verificationToken');
const crypto = require('crypto');

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
    },
    iban: {
        type: String,
    },
    role: {
        type: String,
        default: authHelper.ROLES.BASIC,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
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

userSchema.methods.generateJwtToken = function () {
    const token = jwt.sign({_id: this._id},
        process.env.JWT_TOKEN_SECRET, {expiresIn: '2d'});
    return token;
};

userSchema.methods.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw {error: 'InvalidCredentials'};
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
        throw {error: 'InvalidCredentials'};
    }
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
