const asyncHandler = require('express-async-handler');
import ApiError from '../utils/ApiError.js';

const Product = require('../models/productModel');
const Coupon = require('../models/couponModel');
const Cart = require('../models/cartModel');

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {  // forgot 
    totalPrice += item.quantity * item.price;  // forgot 
  });  
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desc    Add product to  cart
// @route   POST /api/v1/cart
// @access  Private/User
export const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
           // forgot user:req.user
  // 1) Get Cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // create cart fot logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{  productId, // can be title
         color, price: product.price }],
    }); // price form DB color and user
    //  from req.body  req.user._id

  } else {  // must  findIndex  to 
  //  update product quantity
    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.productId.toString()
       === productId && item.color === color
    ); 

    if (productIndex > -1) { 
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart,  push product to cartItems array
      cart.cartItems.push({ productId, color, price: product.price });
    } 
  }

  // Calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Product added to cart successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});


export const addToGuestCart = asyncHandler(async (req, res, next) => {
  if (!req.session.guestCart) {
    req.session.guestCart = {
      cartItems: [],
      totalPrice: 0
    };
  }

  const { productId, quantity } = req.body;
  req.session.guestCart.cartItems.push({
    productId,
    quantity,
    addedAt: new Date()
  });

  await req.session.save();
  
  res.status(200).json({
    status: 'success',
    data: req.session.guestCart
  });
});

// @desc    Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  calcTotalCartPrice(cart);
  cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    clear logged user cart
// @route   DELETE /api/v1/cart
// @access  Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desc    Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`there is no cart for user ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString()
     === req.params.itemId
  );  // item.productId.toString() === producId &&

  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else { 
    return next(
      new ApiError(`there is no item for this id :${req.params.itemId}`, 404)
    );
  }

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});