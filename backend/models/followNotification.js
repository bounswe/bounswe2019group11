const mongoose = require('mongoose');

const followNotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    otherUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
});

const FollowNotification = mongoose.Model('FollowNotification', followNotificationSchema);
module.exports = FollowNotification;
