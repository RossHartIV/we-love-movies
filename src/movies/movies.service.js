const knex = require('../db/connection');

function list() {
    return knex('movies').select('*');
};

function listShowing() {
    return knex('movies as m')
        .join('movies_theaters as mt', 'mt.movie_id', 'm.movie_id')
        .where({ 'mt.is_showing': true })
        .groupBy("m.movie_id")
        .select("m.*");
}

function read(movieId) {
    return knex('movies').select('*').where({ 'movie_id': movieId}).first();
}

function listTheatersWhereShowing(movieId) {
    return knex('movies as m')
        .join('movies_theaters as mt', 'mt.movie_id', 'm.movie_id')
        .join('theaters as t', 't.theater_id', 'mt.theater_id')
        .select('t.*', 'm.movie_id')
        .where({'m.movie_id': movieId})
}

function listReviews(movieId) {
    return knex('reviews').select('*').where({ 'movie_id': movieId })
}

function reviewCritic(criticId) {
    return knex('critics').select('*').where({ 'critic_id': criticId })
}

module.exports = {
    list,
    listShowing,
    read,
    listTheatersWhereShowing,
    listReviews,
    reviewCritic,
}