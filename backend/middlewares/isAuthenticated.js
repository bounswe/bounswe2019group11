const jwt = require('jsonwebtoken');
const moment = require('moment');
const errors = require('../helpers/errors');
const authHelper = require('../helpers/auth');

module.exports = (req, res, next) => {
    const token = authHelper.getTokenFromHeader(req);
    if (!token) {
        return res.status(401).send(errors.MISSING_TOKEN());
    }
    let payload = null;
    try {
        payload = jwt.decode(token, process.env.JWT_TOKEN_SECRET);
    } catch (e) {
        return res.status(401).send(errors.INVALID_TOKEN());
    }
    if (payload.exp < moment.unix()) {
        return res.status(401).send(errors.EXPIRED_TOKEN());
    }
    req.token = {
        data: payload
    };
    return next();
};
