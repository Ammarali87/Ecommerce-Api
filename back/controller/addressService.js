import asyncHandler from 'express-async-handler';

import { findByIdAndUpdate, findById } from '../models/userModel';

//   same as wishlist 

export const addAddress = asyncHandler(async (req, res, next) => {
  // $addToSet => add address object to user addresses  array if address not exist
  const user = await findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Address added successfully.',
    data: user.addresses,
  });
});

export const removeAddress = asyncHandler(async (req, res, next) => {
  // $pull => remove address object from user addresses array if addressId exist
  const user = await findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Address removed successfully.',
    data: user.addresses,
  });
});

export const getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await findById(req.user._id).populate('addresses');

  res.status(200).json({
    status: 'success',
    results: user.addresses.length,
    data: user.addresses,
  });
});