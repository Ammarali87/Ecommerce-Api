import { Router } from 'express';
import { addCategory,getOneCategory, getCategories,
     searchCategories, theFuzzySearch,
      updateCategory, 
      deleteCategory} from 
'../controller/storeController.js';
import upload from "../middleware/uploadMiddleware.js";

const router = Router();
// nested post get delete use this  
// router.route("/:id").get(getOneCategory)
//  one use this router.get("",fun)

// router.get('/search', searchCategories); // Example: /api/v1/search?query=tv
router.post("/add-category", upload.single("image"), addCategory);

// router.post('/newcategory', addCategory);
router.get('/categories', getCategories);
router.get('/category', getOneCategory);
router.get('/search', theFuzzySearch);
router.route("/:id")
.get(getOneCategory)
.post(updateCategory)
.delete(deleteCategory)

export default router;






