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
        from: '"Papel" < daveion.lewyn@niickel.us >',
        to,
        subject,
        text,
    });
};
