const mongoose = require('mongoose');

exports.connect = () => {
    let host, user, pass;
    if (process.env.NODE_ENV === 'test') {
        host = process.env.TEST_DB_HOST;
        user = process.env.TEST_DB_USER;
        pass = process.env.TEST_DB_PASS;
    } else {
        host = process.env.DB_HOST;
        user = process.env.DB_USER;
        pass = process.env.DB_PASS;
    }

    const url = `mongodb+srv://${user}:${pass}@${host}/test?retryWrites=true`;
    console.log(url);

    mongoose.connect(`${url}`, {useNewUrlParser: true, useCreateIndex: true});
    return mongoose.connection;
};
