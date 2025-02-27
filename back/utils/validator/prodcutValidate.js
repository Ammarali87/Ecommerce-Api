import slugify from 'slugify';
import { check } from 'express-validator';
import validationMiddleware from '../../middleware/validationMiddleware.js';
import Category from '../../models/categoryModel.js'; // Add this import

// Shared validation rules
const idValidation = check('id').isMongoId().withMessage('Invalid ID format');

// Custom category existence validator
const categoryExistsValidation = check('category')
  .isMongoId()
  .withMessage('Invalid category ID format')
  .custom(async (categoryId) => {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      return true;
    } catch (error) {
      if (error.message === 'Category not found') {
        throw new Error('Category not found');
      }
      throw new Error('Invalid category ID');
    }
  });


// Product validation rules
const createProductValidator = [
  check('title')
    .notEmpty()
    .withMessage('Product title is required')
    .isLength({ min: 3 })
    .withMessage('Product title must be at least 3 characters')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),

  check('quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isNumeric()
    .withMessage('Product quantity must be a number'),

  check('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isNumeric()
    .withMessage('Product price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),

  categoryExistsValidation,

  check('brand')
    .optional()
    .isMongoId()
    .withMessage('Invalid brand ID format'),

  validationMiddleware,
];

const updateProductValidator = [
  idValidation,
  check('title')
    .optional()
    .custom((val, { req }) => {
      if (val) {
        req.body.slug = slugify(val);
      }
      return true;
    }),
  check('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID format'),
  check('brand')
    .optional()
    .isMongoId()
    .withMessage('Invalid brand ID format'),
  validationMiddleware,
];

const deleteProductValidator = [idValidation, validationMiddleware];
const getProductValidator = [idValidation, validationMiddleware];

export {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
  getProductValidator,
};