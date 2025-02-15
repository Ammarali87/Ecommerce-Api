import { Router } from 'express';

import { createSubCategory,
     getSubCategory,
      getSubCategories,
    //    updateSubCategory,
        // deleteSubCategory,
        //  setCategoryIdToBody,
        //   createFilterObj
         }
           from 
          '../services/subCategoryService';
import { 
    subCategoryValidator, 
    getSubCategoryValidator, 
    // updateSubCategoryValidator,
    // 
    //  deleteSubCategoryValidator
     }
      from '../utils/validators/subCategoryValidator';

// import { protect, allowedTo } from '../services/authService';

// mergeParams: Allow us to access parameters on other routers
// ex: We need to access categoryId from category router
// const router = Router({ mergeParams: true });

router
  .route('/')
  .post(
    // protect,
    // allowedTo('admin', 'manager'),
    // setCategoryIdToBody,
    subCategoryValidator,
    createSubCategory
  )
  .get(
    // createFilterObj,
     getSubCategories);
router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
//   .put(
//     protect,
//     allowedTo('admin', 'manager'),
//     updateSubCategoryValidator,
//     updateSubCategory
//   )
//   .delete(
//     protect,
//     allowedTo('admin'),
//     deleteSubCategoryValidator,
//     deleteSubCategory
//   );

export default router;