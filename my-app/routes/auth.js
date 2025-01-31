import { Router } from 'express';
import { signup, login, logout } from '../controllers/authController';

const router = Router();
//weird no export const amar route
// it will name when import x from "y"
// here just export router 
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

export default router;
