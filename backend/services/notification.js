const FollowNotification = require('../models/followNotification');
const errors = require('../helpers/errors');

const STAGES = {
    MATCH_ID: (userId) => {
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
                type
            }
        }
    },
    PROJECT_FOLLOW: {
        $project: {
            follower: 1,
            type: 1,
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
    return await FollowNotification.aggregate([
        STAGES.MATCH_ID(userId), STAGES.GET_FOLLOWER, STAGES.UNWIND_FOLLOWER,
        STAGES.SET_TYPE('follow'), STAGES.PROJECT_FOLLOW
    ]).then();
};

module.exports.discardNotification = async (notificationId, userId) => {
  const followNotification = await FollowNotification.findOneAndDelete({
      _id: notificationId,
      following: userId,
  });
  if (followNotification) {
      return;
  }

  throw errors.NOTIFICATION_NOT_FOUND();
};
