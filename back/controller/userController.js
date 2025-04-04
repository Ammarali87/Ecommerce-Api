import { User } from '../models/userModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/catchAsync.js';
import { sanitizeUser } from '../utils/sanitizeData.js';

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ active: true }).select('-password');
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users.map(user => sanitizeUser(user))
  });
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user || !user.active) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    status: 'success',
    data: sanitizeUser(user)
  });
});

// @desc    Update user
// @route   PATCH /api/v1/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, active } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, active },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    status: 'success',
    data: sanitizeUser(user)
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});