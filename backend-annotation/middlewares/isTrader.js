const User = require('../models/user');
const errors = require('../helpers/errors');
const authHelper = require('../helpers/auth');

module.exports = async (req, res, next) => {
    try {
        const userId = req.token && req.token.data && req.token.data._id;
        const role = await User
            .findOne({_id: userId})
            .select('-_id role')
            .exec();
        if (!role) {
            return res.status(401).send(errors.USER_NOT_FOUND());
        }
        if (role.role !== authHelper.ROLES.TRADER) {
            return res.status(401).send(errors.NOT_TRADER());
        }
        return next();

    } catch (err) {
        return res.status(500).send(errors.INTERNAL_ERROR(err));
    }
};
