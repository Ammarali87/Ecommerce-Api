import Order from '../models/OrderModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/catchAsync.js';

// Create new order
export const createOrder = asyncHandler(async (req, res) => {
    // Validate order items exist
    if (!req.body.items || !req.body.items.length) {
      throw new ApiError(400, 'Order must contain at least one item');
    }
  
    // Add user ID    
    req.body.user = req.user._id;
    
    // Calculate total amount
    const order = await Order.create(req.body);
    
    // Populate necessary fields
    await order.populate('items.product', 'title price');
    
    res.status(201).json({
      status: 'success',
      data: order
    });
  });



  
// Get all orders (admin only)
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('items.product', 'title price');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders
  });
});



// Get my orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'title price imageCover');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders
  });
});

// Cancel order
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
    status: 'pending'
  });

  if (!order) {
    throw new ApiError(404, 'Order not found or cannot be cancelled');
  }

  order.status = 'cancelled';
  await order.save();

  res.status(200).json({
    status: 'success',
    data: order
  });
});

// Update order status (admin only)
export const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  res.status(200).json({
    status: 'success',
    data: order
  });
});