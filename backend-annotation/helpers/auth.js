const jwt = require('jsonwebtoken');

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

module.exports.getTokenFromHeader = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
};

module.exports.getUserIdOrNull = (req) => {
  const token = module.exports.getTokenFromHeader(req);
  if (!token) {
      return null;
  }
  try {
      return jwt.decode(token, process.env.JWT_TOKEN_SECRET)._id;
  } catch (err) {
      return null;
  }
};
