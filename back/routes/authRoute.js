import { Router } from 'express';
import { check } from 'express-validator';
import validationMiddleware from '../middleware/validationMiddleware.js';
import { 
  signup, 
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyCode
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

// Add this with other validation rules
const verifyCodeValidation = [
  check('code')
    .notEmpty()
    .withMessage('Code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Code must be 6 digits'),
  validationMiddleware
];



// router.post('/verify-email', verifyEmail);
// Auth routes with validation
router.post('/signup', signupValidation, signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCodeValidation, verifyCode);
router.post('/reset-password', resetPasswordValidation, resetPassword);
router.post('/change-password',
   resetPasswordValidation, changePassword);




   
export default router;