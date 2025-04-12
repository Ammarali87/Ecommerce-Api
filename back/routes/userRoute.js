import { Router } from 'express';
import { check } from 'express-validator';
import { protect, allowedTo } from '../controller/authController.js';
import validationMiddleware from '../middleware/validationMiddleware.js';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controller/userController.js';

const router = Router();

// Protect all routes after this middleware
router.use(protect);
router.use(allowedTo('admin'));

// Validation rules
const userUpdateValidation = [
    check('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),
    check('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email')
      .custom(async (email, { req }) => {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== req.params.id) {
          throw new Error('Email already in use');
        }
        return true;
      }),
    check('role')
      .optional()
      .isIn(['user', 'admin', 'manager'])
      .withMessage('Invalid role'),
    validationMiddleware
  ];

  
router.route('/')
  .get(getAllUsers);

router.route('/:id')
  .get(getUser)
  .patch(userUpdateValidation, updateUser)
  .delete(deleteUser);

export default router;