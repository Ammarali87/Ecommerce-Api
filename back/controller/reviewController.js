import { getAll, getOne, createOne, updateOne, deleteOne } from './handlersFactory';
import Review from '../models/reviewModel';

// Nested route
// GET /api/v1/products/:productId/reviews
export function createFilterObj(req, res, next) {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
}

export const getReviews = getAll(Review);

export const getReview = getOne(Review);

// Nested route (Create)
export function setProductIdAndUserIdToBody(req, res, next) {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
}
export const createReview = createOne(Review);

export const updateReview = updateOne(Review);

export const deleteReview = deleteOne(Review);