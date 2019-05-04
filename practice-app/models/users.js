const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const Users = mongoose.model('User', UserSchema);

module.exports = {
    create: user => Users.create(user),
    findOne: user => Users.findOne(user),
    findOneAndUpdate: (query, options) => Users.findOneAndUpdate(query, options),
    find: user => Users.find(user),
    Users,
};