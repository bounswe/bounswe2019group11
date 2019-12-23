const User = require('../models/user');
const errors = require('../helpers/errors');

module.exports.getNearbyUsers = async (userId) => {
    let location = await User
        .findOne({_id: userId})
        .select({'location.displayName': 1})
        .exec();

    if (!location) {
        throw errors.USER_NOT_FOUND();
    }
    location = location.location.displayName;

    return await User
        .find({'location.displayName': location})
        .select({name: 1, surname: 1})
        .exec();
};
