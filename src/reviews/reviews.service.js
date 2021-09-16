const knex = require('../db/connection');

function read(reviewId) {
    return knex('reviews').select('*').where({ 'review_id':reviewId });
}

function destroy(reviewId) {
    return knex('reviews').where({ 'review_id':reviewId }).del();
}

function update(reviewUpdate, reviewId) {
    return knex('reviews')
        .select('*')
        .where({ 'review_id':reviewId })
        .update({ ...reviewUpdate, updated_at:knex.fn.now() })
        .then((res) => res[0]);
}

function reviewCritic(criticId) {
    return knex('critics').select('*').where({ 'critic_id': criticId })
}

module.exports = {
    read,
    destroy,
    update,
    reviewCritic
}