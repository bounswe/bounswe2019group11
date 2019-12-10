const User = require('../models/user');

module.exports.get = async (userId) => {
  return await User
      .findOne({_id: userId})
      .select('-_id money')
      .exec();
};
