import { Router } from 'express';
import { check } from 'express-validator';
import validationMiddleware from '../middleware/validationMiddleware.js';
import { 
  signup, 
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword
} from '../controller/authController.js';

const router = Router();

// Validation rules
const signupValidation = [
  check('name').trim().notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validationMiddleware
];

const resetPasswordValidation = [
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('code').notEmpty().withMessage('Verification code is required'),
  check('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validationMiddleware
];

// Auth routes with validation
router.post('/signup', signupValidation, signup);
router.post('/login', login);
router.get('/logout', logout);

// Email verification
router.post('/verify-email', verifyEmail);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

export default router;