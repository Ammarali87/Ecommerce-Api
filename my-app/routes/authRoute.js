import { Router } from 'express';
import { signup, login, logout } from '../controller/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

export default router;
