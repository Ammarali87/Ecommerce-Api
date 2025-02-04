import { Router } from 'express';
import { addCategory, getCategories } from '../controller/storeControlle.js';
import { searchCategories } from '../controllers/storeController.js';

const router = Router();

router.get('/search', searchCategories); // Example: /api/v1/search?query=tv

router.post('/newcategory', addCategory);
router.get('/categories', getCategories);
router.get('/category', getCategories);

export default router;
