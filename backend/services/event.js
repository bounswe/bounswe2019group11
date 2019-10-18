const Event = require("../models/Event");








module.exports.create = async (title, body, comment, date, authorId, rank, voterNumber, country) => {
    const event = await Event.create({
        title, body, comment, date, authorId, rank, voterNumber, country
    });
    return event;
};

module.exports.delete = async (eventID) => {
    return await Event.findByIdAndDelete(articleID);
}; 