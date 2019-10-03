module.exports.ROLES = {
    BASIC: 'BASIC',
    TRADER: 'TRADER',
    ADMIN: 'ADMIN'
};

const ibanRegex = new RegExp('^([A-Z]{2}[ \\-]?[0-9]{2})(?=(?:[ \\-]?[A-Z0-9]){9,30}$)' +
    '((?:[ \\-]?[A-Z0-9]{3,5}){2,7})([ \\-]?[A-Z0-9]{1,3})?$');
const idNumberRegex = new RegExp('^[0-9]{11}$');

module.exports.validateIdNumber = (idNumber) => {
    return idNumberRegex.test(idNumber);
};

module.exports.validateIban = (iban) => {
    return ibanRegex.test(iban);
};
