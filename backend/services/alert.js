const Alert = require('../models/alert');

module.exports.getAlerts = async (userId) => {
  return await Alert
      .find({userId})
      .select('-userId')
      .exec();
};
