import { Router } from 'express';
import { protect, allowedTo } from '../controller/authController.js';
import { createReview, getProductReviews } from '../controller/reviewController.js';
import { createReviewValidator } from '../utils/validator/reviewValidator.js';

const router = Router({ mergeParams: true }); // Enable params merging

router.route('/')
  .get(getProductReviews)
  .post(
    protect, 
    allowedTo('user'),
    createReviewValidator,
    createReview
  );

export default router;