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