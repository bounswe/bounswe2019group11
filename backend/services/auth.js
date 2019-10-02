const User = require('../models/user');
const VerificationToken = require('../models/verificationToken');
const authHelper = require('../helpers/auth');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    }
});

function generateSignUpMail(name, surname, email, verificationToken) {
    return {
        from: '"Traders\' Platform" < c3198352@urhen.com >',
        to: email,
        subject: 'Traders\' Platform Email Verification',
        text: `Hi ${name} ${surname}\nPlease click on the link below to verify your account.\n
        http://localhost:3000/auth/sign-up/verification?verificationToken=${verificationToken}`,
    };
}

async function sendVerificationEmail(user, verificationToken) {
    await transporter.sendMail(generateSignUpMail(user.name, user.surname, user.email, verificationToken));
}

module.exports.isUserExists = async (email) => {
    const count = await User.countDocuments({email});
    return count !== 0;
};

module.exports.signUp = async (name, surname, email, password, idNumber, iban) => {
    let role;
    if (authHelper.validateIdNumber(idNumber) && authHelper.validateIban(iban)) {
        role = authHelper.ROLES.TRADER;
    } else {
        role = authHelper.ROLES.BASIC;
    }
    const user = await User.create({
        name, surname, email, password, idNumber, iban, role,
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
