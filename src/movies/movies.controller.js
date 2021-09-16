const service = require('./movies.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function list(req, res, next) {
    const data = req.query.is_showing
        ? await service.listShowing()
        : await service.list();
    res.status(200).json({ data })
}

async function hasMovieId(req, res, next){
    const { movieId } = req.params;
    const movieData = await service.read(Number(movieId));
    if (!movieData) {
        return next({ status: 404, message: `movieId: ${movieId} not found` });
    }
    res.locals.movie = movieData;
    next();
}

async function read(req, res, next) {
    res.status(200).json({ data: res.locals.movie })
}

async function listTheaters(req, res, next) {
    const data = await service.listTheatersWhereShowing(res.locals.movie.movie_id)
    res.status(200).json({ data })
}

async function listReviews(req, res, next) {
    const movieReviewsData = await service.listReviews(res.locals.movie.movie_id);
    let data = [];
    for (let i = 0; i < movieReviewsData.length; i++) {
        const criticData = await service.reviewCritic(movieReviewsData[i].critic_id);
        movieReviewsData[i]['critic'] = criticData[0];
        data.push(movieReviewsData[i])
    }
    res.status(200).json({ data })
}



module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(hasMovieId), asyncErrorBoundary(read)],
    listTheaters: [asyncErrorBoundary(hasMovieId), asyncErrorBoundary(listTheaters)],
    listReviews: [asyncErrorBoundary(hasMovieId), asyncErrorBoundary(listReviews)],
}