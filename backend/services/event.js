const Event = require("../models/event");


module.exports.getByID = async (_id) => {
    return await Event.findOne({
        _id,
    });
};

module.exports.getAll = async (Country, Rank, SDate) => {
    try {
        const condition = {};
        if(Country) {condition['country'] = Country};
        if(Rank) {condition['rank'] = Rank};
        if(SDate) {condition['StartDate'] = SDate};
        return events = await Event.find(condition) 
    } catch(e) {
      console.log(e)
    }
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


