const Annotation = require('../models/annotations');

module.exports.createAnnotation = async (type,creator,created,body,target) =>{
    target['source'] = process.env.API_URL + "/article/"+target['id'];
    const annotation = await Annotation.create({type,creator,created,body,target});
    return annotation;
};

module.exports.getAnnotationsByArticleId = async (articleId) =>{
    const annotation = await Annotation.find({'target.id': articleId});
    return annotation;
};
module.exports.getAnnotationsById = async (annotationId) =>{
    const annotation = await Annotation.findOne({_id: annotationId});
    return annotation;
};
module.exports.addBody = async (annotationId,body) =>{
    const theAnnotation = await this.getAnnotationsById(annotationId);
    theAnnotation.body.push(body);
    return await theAnnotation.save();
};
