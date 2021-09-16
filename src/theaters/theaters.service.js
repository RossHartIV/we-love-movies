const knex = require('../db/connection');

function list() {
    return knex('theaters').select('*');
}

function moviesShowing(theaterId) {
    return knex('movies as m')
        .join('movies_theaters as mt', 'mt.movie_id', 'm.movie_id')
        .join('theaters as t', 'mt.theater_id', 't.theater_id')    
        .select('m.*', "mt.is_showing")
        .where({ "t.theater_id": theaterId })
}

module.exports = {
    list,
    moviesShowing
}