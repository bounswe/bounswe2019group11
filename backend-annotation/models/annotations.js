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
    purpose:{
        type: String,
        enum: ["highlighting","questioning","describing","commenting"],
        default: "commenting"
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
    format:{
        type: String,
        enum:["text/plain","image/jpeg"]
    },
    selector:{
        type: {
            type: String,
            enum: ["DataPositionSelector","FragmentSelector"],
            default: "DataPositionSelector"
        },
        start: {
            type: Number
        },
        end: {
            type: Number
        },
        conformsTo:{
            type: String,
            default: "http://www.w3.org/TR/media-frags/"
        },
        value:{
            type:String
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
    motivation:{
      type: String,
      enum: ["highlighting","questioning","describing","commenting"],
      default: "highlighting"
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
