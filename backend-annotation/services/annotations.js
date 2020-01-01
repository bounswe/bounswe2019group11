const Annotation = require('../models/annotations');
const axios = require('axios');

module.exports.createAnnotation = async (type,creator,created,body,target) =>{
    target['source'] = process.env.API_URL + "/article/"+target['id'];
    const response = await axios.get(process.env.API_URL+'/user/'+creator);
    const user = response.data;
    const bodyCreator = {
            id: user._id,
            name:user.name,
            surname:user.surname

    };
    body.creator = bodyCreator;
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
    const response = await axios.get(process.env.API_URL+'/user/'+body.creator);
    const user = response.data;
    const bodyCreator = {
        id: user._id,
        name:user.name,
        surname:user.surname

    };
    body.creator = bodyCreator;
    theAnnotation.body.push(body);
    return await theAnnotation.save();
};
