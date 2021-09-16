const service = require('./theaters.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function list(req, res, next) {
    const allTheaters = await service.list();
    const data = [];

    for (let i = 0; i<allTheaters.length; i++) {
        const theaterMovies = await service.moviesShowing(allTheaters[i].theater_id);
        data.push({ ...allTheaters[i], 'movies': theaterMovies});
    }
    
    res.status(200).json({ data })
}

module.exports = {
    list: asyncErrorBoundary(list)
}