const Event = require("../models/event");
const mongoose = require('mongoose');
const errors = require('../helpers/errors');
const EventComment = require('../models/eventComment');
const STAGES = {
    GET_COMMENTS: {
        $lookup: {
            from: 'eventcomments',
            let: {
                eventId: '$_id'
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$$eventId', '$eventId']
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            authorId: '$authorId'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$$authorId', '$_id']
                                    }
                                }
                            },
                            {
                                $project: {
                                    name: 1,
                                    surname: 1,
                                    _id: 0,
                                }
                            }
                        ],
                        as: 'author'
                    }
                },
                {
                    $project: {
                        eventId: 0
                    }
                }
            ],
            as: 'comments'
        }
    },
    MATCH_ID: (id) => {
        return {
            $match: {
                $expr: {
                    $eq: ['$_id', {
                        $toObjectId: id,
                    }]
                }
            }
        }
    },
    MATCH_COMMENT: (id) => {
        return {
            $match: {
                $expr: {
                    $eq: ['$_id', {
                        $toObjectId: id,
                    }]
                }
            }
        }
    },

};

module.exports.getByID = async (_id) => {
    if (!(mongoose.Types.ObjectId.isValid(_id))) {
        throw errors.EVENT_NOT_FOUND();
    }
    const event = await Event.aggregate([
        STAGES.MATCH_ID(_id), STAGES.GET_COMMENTS
    ]).then();
    if (!event) {
        throw errors.EVENT_NOT_FOUND();
    }
    return event[0];
};

module.exports.getAll = async () => {
    return await Event.find();
};

module.exports.getByCountry = async (country) => {
    return await Event.find({
        country,
    });
};

module.exports.create = async (title, body, comment, date, rank, country) => {
    return await Event.create({
        title, body, comment, date, rank, country
    });
};

module.exports.delete = async (_id) => {
    return await Event.deleteOne({_id});
};


module.exports.postComment = async (eventId, authorId, body) => {
    if (!(mongoose.Types.ObjectId.isValid(eventId))) {
        throw errors.EVENT_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    await EventComment.create({
        eventId,
        authorId,
        body,
    });
};

module.exports.getComment = async (eventId, commentId) => {
    if (!(mongoose.Types.ObjectId.isValid(eventId))) {
        throw errors.EVENT_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    const comment = await EventComment.aggregate([
        STAGES.MATCH_COMMENT(commentId)
    ]).then();
    if (!comment) {
        throw errors.COMMENT_NOT_FOUND();
    }
    return comment[0];
};

module.exports.editComment = async (eventId, authorId, commentId, newBody) => {
    if (!(mongoose.Types.ObjectId.isValid(eventId))) {
        throw errors.EVENT_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    const oldComment = await EventComment.findOneAndUpdate({_id: commentId, eventId, authorId},
        {body: newBody, edited: true, lastEditDate: Date.now()});
    if (!oldComment) {
        throw errors.COMMENT_NOT_FOUND();
    }
};

module.exports.deleteComment = async (eventId, commentId, authorId) => {
    if (!(mongoose.Types.ObjectId.isValid(eventId))) {
        throw errors.EVENT_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(commentId))) {
        throw errors.COMMENT_NOT_FOUND();
    }
    if (!(mongoose.Types.ObjectId.isValid(authorId))) {
        throw errors.USER_NOT_FOUND();
    }
    const comment = await EventComment.findOneAndDelete({_id: commentId, eventId, authorId});
    if (!comment) {
        throw errors.COMMENT_NOT_FOUND();
    }
};


