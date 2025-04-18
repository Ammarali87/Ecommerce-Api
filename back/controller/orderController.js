import Order from '../models/OrderModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/catchAsync.js';
import { getAll, getOne, createOne,
  updateOne, deleteOne } from './handlersFactory.js';

  

// db.mycollection.updateOne({name: "John"}, {$set: {age: 31}})
// show dbs
// // or
// show databases
// use mydatabase

// check   db
// show collections


// Create new order

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
      
  // ✅ تحقق إن فيه عناصر في الطلب
  if (!items || !items.length) {
    throw new ApiError(400, 'Order must contain at least one item');
  }

  // ✅ أنشئ البيانات الأساسية للأوردر
  const orderData = {
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
  };

  // ✅ أنشئ الأوردر
  const order = await Order.create(orderData);

  // ✅ املى بيانات المنتج في العناصر
  await order.populate('items.product', 'title price');
    // get form items.prodcut only the name and email 

  
    // لاحظ  item.product.price  also must add popult because the price 
    // came from DB not order body  qunatit from orede body 
  let totalPrice = 0;
  order.items.forEach(item => {
    totalPrice += item.quantity * item.product.price;
  });  

  // (اختياري) ممكن تضيف السعر الكلي للأوردر لو السكيمة بتدعمه
  order.totalPrice = totalPrice;
  await order.save();

  res.status(201).json({
    status: 'success',
    data: {
      order,
      totalPrice,
    },
  });
});

// export const createOrder = asyncHandler(async (req, res) => {
//     // Validate order items exist
//     if (!req.body.items || !req.body.items.length) {
//       throw new ApiError(400, 'Order must contain at least one item');
//     }
  
//     // Add user ID    
//     req.body.user = req.user._id;

//     // create order
//     const order = await Order.create(req.body);
       
//     // Populate necessary fields
//     await order.populate('items.product', 'title price');
    
//     res.status(201).json({
//       status: 'success',
//       data: order
//     });
//   });




// Cancel order


export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
    status: 'pending'
  });   
  //   //or 
  //     // const order = await Order.findByIdAndUpdate(
  //     // {req.params.id}, not req.user._id
  //     // {status: req.body.status},
  //     // {new :true , runValidators:true}

  if (!order) {
    return next(new ApiError(404, 'Order not found or cannot be cancelled'));
  }

  order.status = 'cancelled';
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order has been cancelled successfully',
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



// Get all orders (admin only)
export const getMyOrder = getOne(Order, { path: 'items.product', select: 'title price' });
export const getAllOrders = getAll(Order,{path:"user",select:"name email"});
export const deleteOrder = deleteOne(Order);  // this cancel not delete




// export const getOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find()
//     .populate('user', 'name email') 
//     // get form user only the name and email 
//     .populate('items.product', 'title price');

//     res.status(200).json({
//     status: 'success',
//     results: orders.length,
//     data: orders
//   });
// });



// // Get my orders
// export const getMyOrders = asyncHandler(async (req, res) => {
//   const orders = await Order.find({ user: req.user._id })
//     .populate('items.product', 'title price imageCover');

//   res.status(200).json({
//     status: 'success',
//     results: orders.length,
//     data: orders
//   });
// }); 
