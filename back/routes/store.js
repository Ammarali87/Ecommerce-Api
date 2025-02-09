import { Router } from 'express';
import { addCategory,getOneCategory, getCategories, searchCategories, theFuzzySearch } from 
'../controller/storeController.js';
import upload from "../middleware/uploadMiddleware.js";

const router = Router();
// nested post get delete use this  
// router.route("/:id").get(getOneCategory)
//  one use this router.get("",fun)

router.post("/add-category",
     upload.single("image"), addCategory);

router.route('/category').post(addCategory).get(getOneCategory);
router.get('/categories', getCategories);
router.get('/search', theFuzzySearch);
router.route("/:id").get(getOneCategory)
router.get("/:id",getOneCategory)
export default router;











// import { Router } from 'express';
// import { addCategory,getOneCategory, getCategories, searchCategories, theFuzzySearch } from 
// '../controller/storeController.js';
// import upload from "../middleware/uploadMiddleware.js";

// const router = Router();
// //  nested post get delete  
// // router.route("/:id").get(getOneCategory)
// // router.get("",fun)

// // router.get('/search', searchCategories); // Example: /api/v1/search?query=tv
// router.post("/add-category", upload.single("image"), addCategory);

// // router.post('/newcategory', addCategory);
// router.get('/categories', getCategories);
// router.get('/category', getOneCategory);
// router.get('/search', theFuzzySearch);
// router.route("/:id").get(getOneCategory)
// router.get("/:id",getOneCategory)
// export default router;
