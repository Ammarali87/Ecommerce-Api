import { Router } from 'express';
import { addCategory, getCategories } from '../controller/storeControlle.js';

const router = Router();

router.post('/newcategory', addCategory);
router.get('/categories', getCategories);
// router.get('/category', getCategories);

export default router;
