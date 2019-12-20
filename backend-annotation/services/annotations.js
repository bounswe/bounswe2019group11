const Annotation = require('../models/annotations');

module.exports.createAnnotation = async (type,creator,created,body,target) =>{
    const annotation = await Annotation.create({type,creator,created,body,target});
    return annotation;
};