import slugify from 'slugify';
import { check } from 'express-validator';
import validationMiddleware from '../../middleware/validationMiddleware.js';

const idValidation = check('id').isMongoId().withMessage('Invalid ID format');
const nameValidation = check('name')
  .notEmpty().withMessage('Brand name is required')
  .isLength({ min: 2 }).withMessage('Too short Brand name')
  .custom((val, { req }) => {
 // any two param strucher {req} from it  name= "my Title"= my-title
    req.body.slug = slugify(val);
    return true;
  });

export const getBrandValidator = [idValidation, validationMiddleware];
export const createBrandValidator = [
  nameValidation, // err no need to id in creation
  // check('brandId').notEmpty().withMessage('Brand ID is required')
// .isMongoId().withMessage('Invalid Brand ID format'),
  validationMiddleware,
];
export const updateBrandValidator = [
  idValidation,
  nameValidation.optional(),
  validationMiddleware,
];
export const deleteBrandValidator = [idValidation, validationMiddleware];
