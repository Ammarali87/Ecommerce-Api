import { Router } from 'express';
import { check } from 'express-validator';
import validationMiddleware from '../middleware/validationMiddleware.js';
import { 
  signup, 
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getAllUsers,    // Add these new imports
  getUser,
  updateUser,
  deleteUser
} from '../controller/authController.js';

const router = Router();

// Validation rules for user operations
const userUpdateValidation = [
  check('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  check('email').optional().isEmail().withMessage('Please provide a valid email'),
  check('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validationMiddleware
];

// Existing validation rules
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

// Email verification and password reset
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', userUpdateValidation, updateUser);
router.delete('/users/:id', deleteUser);

export default router;