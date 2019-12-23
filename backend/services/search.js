const request = require('request-promise');
const Article = require('../models/article');
const Currency = require('../models/currency');
const Event = require('../models/event');
const Stock = require('../models/stock');
const User = require('../models/user');

module.exports.search = async (term) => {
    const similarTerms = await getSimilarTerms(term);
    const searchText = prepareSearchText(similarTerms);
    const searchCondition = {$text: {$search: searchText}};
    const response = {};

    response['articles'] = await Article
        .find(searchCondition)
        .select({title: 1})
        .exec();
    if (response['articles'] && response['articles'].length === 0) {
        response['articles'] = await Article
            .find({title: {$regex: `^${term}`, $options: 'i'}})
            .select({title: 1})
            .exec()
    }
    response['currencies'] = await Currency
        .find(searchCondition)
        .select({code: 1})
        .exec();
    response['events'] = await Event
        .find(searchCondition)
        .select({title: 1, country: 1})
        .exec();
    response['stocks'] = await Stock
        .find(searchCondition)
        .select({stockSymbol: 1})
        .exec();
    response['users'] = await User
        .find(searchCondition)
        .select({name: 1, surname: 1, 'location.displayName': 1})
        .exec();
    if (response['users'] && response['users'].length === 0) {
        response['users'] = await User
            .find({name: {$regex: `^${term}`, $options: 'i'}})
            .select({name: 1, surname: 1, 'location.displayName': 1})
            .exec();
    }

    return response;
};

function prepareSearchText(similarTerms) {
    let searchText = '';
    for (let i = 0; i < similarTerms.length; i++) {
        searchText += `${similarTerms[i]} `
    }
    return searchText.trim();
}

async function getSimilarTerms(term) {
    const similarTerms = [term];
    const params = {
        ml: term,
        max: 10
    };
    const options = {
        url: process.env.DATAMUSE_URL,
        qs: params,
    };

    try {
        let response = await request.get(options);
        response = JSON.parse(response);
        for (let i = 0; i < response.length; i++) {
            similarTerms.push(response[i]['word']);
        }
    } catch (err) {
        console.log('API request to Datamuse failed: ' + err);
    }
    return similarTerms;
}
