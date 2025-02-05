import { Router } from 'express';
import { addCategory, getCategories, searchCategories, theFuzzySearch } from 
'../controller/storeController.js';
import upload from "../middleware/uploadMiddleware.js";

const router = Router();

// router.get('/search', searchCategories); // Example: /api/v1/search?query=tv

router.post("/add-category", upload.single("image"), addCategory);

// router.post('/newcategory', addCategory);
router.get('/categories', getCategories);
router.get('/category', getCategories);
router.get('/search', theFuzzySearch);

export default router;
