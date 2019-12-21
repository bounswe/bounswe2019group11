const FollowNotification = require('../models/followNotification');
const errors = require('../helpers/errors');
const AlertNotification = require('../models/alertNotification');

const STAGES = {
    MATCH_FOLLOW_ID: (userId) => {
        return {
            $match: {
                $expr: {
                    $eq: ['$following', {
                        $toObjectId: userId
                    }]
                }
            }
        }
    },
    GET_FOLLOWER: {
        $lookup: {
            from: 'users',
            let: {
                follower: '$follower'
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$_id', '$$follower']
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        surname: 1,
                    }
                }
            ],
            as: 'follower'
        }
    },
    UNWIND_FOLLOWER: {
        $unwind: '$follower'
    },
    SET_TYPE: (type) => {
        return {
            $addFields: {
                notification: type
            }
        }
    },
    PROJECT_FOLLOW: {
        $project: {
            following: 0,
            __v: 0
        }
    },
    MATCH_ALERT_ID: (userId) => {
        return {
            $match: {
                $expr: {
                    $eq: ['$userId', {
                        $toObjectId: userId
                    }]
                }
            }
        }
    },
    PROJECT_ALERT: {
        $project: {
            userId: 0,
            __v: 0,
        }
    }
};

module.exports.createFollowNotification = async (follower, following) => {
    await FollowNotification.create({follower, following});
};

module.exports.deleteFollowNotification = async (follower, following) => {
    await FollowNotification.deleteOne({follower, following});
};

module.exports.getAll = async (userId) => {
    const notifications = [];
    const followNotifications = await FollowNotification.aggregate([
        STAGES.MATCH_FOLLOW_ID(userId), STAGES.GET_FOLLOWER, STAGES.UNWIND_FOLLOWER,
        STAGES.SET_TYPE('follow'), STAGES.PROJECT_FOLLOW
    ]).then();

    const alertNotifications = await AlertNotification.aggregate([
        STAGES.MATCH_ALERT_ID(userId), STAGES.SET_TYPE('alert'), STAGES.PROJECT_ALERT
    ]);

    notifications.push(...followNotifications);
    notifications.push(...alertNotifications);
    return notifications;
};

module.exports.discardNotification = async (notificationId, userId) => {
  const followNotification = await FollowNotification.findOneAndDelete({
      _id: notificationId,
      following: userId,
  });
  if (followNotification) {
      return;
  }

  const alertNotification = await AlertNotification.findOneAndDelete({
      _id: notificationId,
      userId
  });
  if (alertNotification) {
      return;
  }

  throw errors.NOTIFICATION_NOT_FOUND();
};
