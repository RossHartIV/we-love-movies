const service = require('./reviews.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function hasReviewId(req, res, next){
    const { reviewId } = req.params;
    const reviewData = await service.read(reviewId);
    if (!reviewData[0]) {
        return next({ status: 404, message: `/cannot be found/i` });
    }
    res.locals.review = reviewData[0];
    next();
}

function verifyBody(req, res, next){
    const { data: { score = null, content = null } = {} } = req.body;
    let updatedReview = {};
    if (!score && !content) return next({ status: 400, message: "Missing score or content in body" });
    if (score) updatedReview.score = score;
    if (content) updatedReview.content = content;
    res.locals.updatedReview = updatedReview;
    next();
}



async function destroy(req, res, next) {
    const { review_id } = res.locals.review;
    await service.destroy(review_id);
    res.sendStatus(204);
}

async function update(req, res, next) {
    const { critic_id, review_id} = res.locals.review;
    const critic = await service.reviewCritic(critic_id);

    const { updatedReview } = res.locals
    await service.update(updatedReview, review_id);
    const newReview = await service.read(review_id);

    res.status(200).json({ data: {...newReview[0], critic: critic[0]} })
}

module.exports = {
    destroy: [asyncErrorBoundary(hasReviewId), asyncErrorBoundary(destroy)],
    update: [asyncErrorBoundary(hasReviewId), asyncErrorBoundary(verifyBody), asyncErrorBoundary(update)]
}