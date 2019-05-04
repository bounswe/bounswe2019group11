const mongoose = require('mongoose');

exports.connect = () => {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const pass = process.env.DB_PASS;

  const url = `mongodb+srv://${user}:${pass}@${host}/test?retryWrites=true`;
  console.log(url);

  mongoose.connect(`${url}`, {useNewUrlParser: true, useCreateIndex: true});
  return mongoose.connection;
};
