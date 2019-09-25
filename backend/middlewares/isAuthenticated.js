const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../models/user');

function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}

module.exports = async (req, res, next) => {
    const token = getTokenFromHeader(req);
    if (!token) {
        return res.status(401).send({ error: 'MissingToken' });
    }
    let payload = null;
    try{
        payload = jwt.decode(token, process.env.JWT_TOKEN_SECRET);
    } catch (e) {
        return res.status(401).send({ error: 'InvalidToken' });
    }
    if (payload.exp < moment.unix()) {
        return res.status(401).send({ error: 'ExpiredToken' });
    }
    try {
        const user = await User.findOne(payload.sub);
        if (!user) {
            return res.status(401).send({ error: 'UserNotFound' });
        }
        delete user.password;
        req.user = user;
        return next();
    } catch (e) {
        return res.status(500).send({ error: `DatabaseError: ${e}`});
    }
};
