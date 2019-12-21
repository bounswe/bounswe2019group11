const mongoose = require('mongoose');
const bodySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["TextualBody"],
        default: "TextualBody"
    },
    value: {
        type: String,
        default: "My first Body",
    },
    format:{
        type: String,
        enum: ["text/plain"],
        default: "text/plain",
        language: "en"
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    created: {
        type: Date,
        default: Date.now,
        required: true,
    }

});

const targetSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Article"
    },
    source: {
        type: String,
    },
    selector:{
        type: {
            type: String,
            enum: ["DataPositionSelector","SvgSelector"],
            default: "DataPositionSelector"
        },
        start: {
            type: Number
        },
        end: {
            type: Number
        }
    }

});

const annotationSchema = new mongoose.Schema({
    "@context": {
        type: String,
        default: 'http://www.w3.org/ns/anno.jsonld',
    },
    id: {
        type: String
    },
    type: {
        type: String,
        default: 'Annotation',
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now,
        required: true,
    },
    body: [bodySchema],

    target: targetSchema

});

const Annotation = mongoose.model('Annotation', annotationSchema);

module.exports = Annotation;
