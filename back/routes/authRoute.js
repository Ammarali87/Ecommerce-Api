import { Router } from 'express';
import { 
  signup, 
  login, 
  logout, 
  getAllUsers, 
  getUser,
  requestVerification,
  verifyEmail,
  forgotPassword,
  resetPassword 
} from '../controller/authController.js';

const router = Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

// Verification routes
router.post('/verify/request', requestVerification);
router.get('/verify/:token', verifyEmail);

// Password reset routes
router.post('/password/forgot', forgotPassword);
router.patch('/password/reset/:token', resetPassword);

// User routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);

export default router;