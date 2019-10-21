const iban = require('iban');

module.exports.ROLES = {
    BASIC: 'BASIC',
    TRADER: 'TRADER',
    ADMIN: 'ADMIN'
};

const idNumberRegex = new RegExp('^[0-9]{11}$');

module.exports.isTrader = (idNumber, iban) => {
    return idNumber || iban;
};

module.exports.validateIdNumber = (idNumber) => {
    return idNumberRegex.test(idNumber);
};

module.exports.validateIban = (iban_) => {
    return iban.isValid(iban_);
};
