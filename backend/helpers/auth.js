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
    if (!idNumber) {
        return true;
    }
    return idNumberRegex.test(idNumber);
};

module.exports.validateIban = (iban_) => {
    if (!iban_) {
        return true;
    }
    return iban.isValid(iban_);
};
