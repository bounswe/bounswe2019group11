const Currency = require('../models/currency');

module.exports.getAll = async () => {
  return await Currency
      .find()
      .select('code name rate -_id')
      .exec();
};
