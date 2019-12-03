const FollowNotification = require('../models/followNotification');

module.exports.createFollowNotification = async (userId, otherUserId) => {
    await FollowNotification.create({userId, otherUserId});
};

module.exports.deleteFollowNotification = async (userId, otherUserId) => {
    await FollowNotification.deleteOne({userId, otherUserId});
};
