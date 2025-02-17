import { Router } from 'express';
import {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
} from '../controller/subCategoryController.js';

import {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} from '../utils/validator/subCategoryValidator.js';

const router = Router({ mergeParams: true });

// GET /api/v1/subcategories
// GET /api/v1/categories/:categoryId/subcategories
router.route('/')
  .post(createSubCategoryValidator, createSubCategory)
  .get(getSubCategories);

router.route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);


export default router;

