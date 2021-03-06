const mongoose = require('mongoose');

const followNotificationSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
});

const FollowNotification = mongoose.model('FollowNotification', followNotificationSchema);
module.exports = FollowNotification;
