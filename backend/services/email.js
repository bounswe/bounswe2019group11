const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    }
});

module.exports.sendMail = async (to, subject, text) => {
    await transporter.sendMail({
        from: '"Papel" < c3198352@urhen.com >',
        to,
        subject,
        text,
    });
};
