const Event = require("../models/Event");



module.exports.getByID = async (eventID) => {
    return await Event.findOne({
        _id: eventID,
    });
};

module.exports.getAll = async ()=>{
    return await Event.find();
};

module.exports.getByCountry = async (country_) => {
    return await Event.find({
        country: country_,
    });
};

module.exports.create = async (title, body, comment, date, authorId, rank, voterNumber, country) => {
    
    const event = await Event.create({
        title, body, comment, date, authorId, rank, voterNumber, country
    });
    return event;
};

module.exports.delete = async (eventID) => {
    return await Event.findByIdAndDelete(eventID);
}; 


