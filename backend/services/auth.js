const User = require('../models/user');
const VerificationToken = require('../models/verificationToken');
const authHelper = require('../helpers/auth');
const errors = require('../helpers/errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('./email');

async function sendVerificationEmail(user, verificationToken) {
    const text = `Hi ${user.name} ${user.surname}\nPlease click on the link below to verify your account.\n
        http://localhost:3000/auth/sign-up/verification/${verificationToken}`;
    await emailService.sendMail(user.email, 'Papel Email Verification', text);
}

module.exports.isUserExists = async (email) => {
    const count = await User.countDocuments({email});
    return count !== 0;
};

module.exports.signUp = async (name, surname, email, password, idNumber, iban, location) => {
    let role;
    if (authHelper.isTrader(idNumber, iban)) {
        role = authHelper.ROLES.TRADER;
    } else {
        role = authHelper.ROLES.BASIC;
    }
    const user = await User.create({
        name, surname, email, password, idNumber, iban, role, location
    });
    const verificationToken = await user.generateVerificationToken();
    await sendVerificationEmail(user, verificationToken.token);
};

module.exports.findVerificationToken = async (verificationToken) => {
    return await VerificationToken.findOne({
        token: verificationToken,
    });
};

module.exports.getUser = async (id) => {
    return await User.findOne({
        _id: id,
    });
};

function generateJwtToken(_id) {
    return jwt.sign({_id},
        process.env.JWT_TOKEN_SECRET, {expiresIn: '2d'});
}

module.exports.login = async (email, password) => {
    let user = await User.findOne({email}).select('+password').exec();
    if (!user) {
        throw errors.INVALID_CREDENTIALS();
    }
    const isPasswordMatched = await bcrypt.compareSync(password, user.password);
    if (!isPasswordMatched) {
        throw errors.INVALID_CREDENTIALS();
    }
    if (!user.isVerified) {
        throw errors.USER_NOT_VERIFIED();
    }
    const token = generateJwtToken(user._id);
    user = user.toObject();
    delete user.password;
    return {
        token,
        user,
    };
};

module.exports.resendVerificationMail = async (email) => {
    const user = await User.findOne({email}).exec();
    if (!user) {
        throw errors.USER_NOT_FOUND();
    }
    if (user.isVerified) {
        throw errors.USER_ALREADY_VERIFIED();
    }
    let verificationToken = VerificationToken.findOne({_userId: user._id});
    if (!verificationToken) {
        verificationToken = await user.generateVerificationToken();
    }
    await sendVerificationEmail(user, verificationToken.token);
};
