const User = require('../models/user');
const errors = require('../helpers/errors');


module.exports.get = async (userId) => {
  return await User
      .findOne({_id: userId})
      .select('-_id money')
      .exec();
};

module.exports.deposit = async (userId, amount) => {
    if (isNaN(amount) || amount <= 0) {
        throw errors.INVALID_AMOUNT();
    }
    amount = Number(amount);
    await User.updateOne({_id: userId}, {$inc: {money: amount}});
};

module.exports.withdraw = async (userId, amount) => {
    if (isNaN(amount) || amount <= 0) {
        throw errors.INVALID_AMOUNT();
    }
    amount = Number(amount);
    const res = await User.updateOne({_id: userId, money: {$gte: amount}}, {$inc: {money: -1 * amount}});
    if (!res || res.n !== 1) {
        throw errors.INSUFFICIENT_FUND();
    }
};
