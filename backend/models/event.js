const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    comment:{
        type: Array,
        ref: 'Comment'
    },
    date: {
        type: Date,
        required: true    
    },
    authorId:{
        type:String,
        required: true
    },
    rank:{
        type: Number
    },
    voterNumber:{
        type: Number
    },
    country:{
        type: String
    }

});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;