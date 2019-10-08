const User = require('../models/user');
const errors = require('../helpers/errors');

module.exports.attachUser = async (req, res, next) => {
    try {
        const payload = req.token.payload;
        const user = await User.findOne({ _id: payload.sub });
        if (!user) {
            return res.status(401).send(errors.USER_NOT_FOUND());
        }
        delete user.password;
        req.user = user;
        return next();
    } catch (e) {
        return res.status(500).send(errors.DATABASE_ERROR(e));
    }
};
