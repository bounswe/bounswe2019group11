const Event = require("../models/event");


module.exports.getByID = async (_id) => {
    return await Event.findOne({
        _id,
    });
};

module.exports.getAll = async () => {
    return await Event.find();
};

module.exports.getByCountry = async (country) => {
    return await Event.find({
        country,
    });
};

module.exports.create = async (title, body, date, rank, country) => {
    return await Event.create({
        title, body, date, rank, country
    });
};

module.exports.delete = async (_id) => {
    return await Event.deleteOne({_id});
}; 


