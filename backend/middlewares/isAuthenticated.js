const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../models/user');
const errors = require('../helpers/errors');

function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}

module.exports = (req, res, next) => {
    const token = getTokenFromHeader(req);
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
