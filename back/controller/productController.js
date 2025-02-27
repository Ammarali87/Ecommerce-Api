import Product from '../models/ProductModel.js';
import Category from '../models/CategoryModel.js';
import slugify from 'slugify';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import cloudinary from "../config/cloudinaryConfig.js";




// Create new product
export const createProduct = catchAsync(async (req, res, next) => {
  const { title, description, quantity, price, category, brand, imageCover } = req.body;
    
  // move to Vaildate middware 
  
  //  const existCategory = await Category.findById(category);
  //  if (!existCategory) {
  //     return next(new ApiError(404 , "Category not Found"))  
  // }

  // Remove the image URL concatenation
  const product = await Product.create({
    title,
    slug: slugify(title, { lower: true }),
    description,
    quantity,
    price,
    category,
    brand,
    imageCover // Use the image URL directly
  });

  return res.status(201).json({
    status: 'success',
    data: product
  });
});



// export const createProduct = catchAsync(async (req, res, next) => {
//   const { title, description, quantity, price, category, brand, imageCover } = req.body;

//   // Create product with direct image URL if provided in body
//   if (imageCover) {
//     const product = await Product.create({
//       title,
//       slug: slugify(title, { lower: true }),
//       description,
//       quantity,
//       price,
//       category,
//       brand,
//       imageCover // Use direct URL from request body
//     });

//     return res.status(201).json({
//       status: 'success',
//       data: product
//     });
//   }

//   // If no image URL provided, handle file upload
//   if (req.file) {
//     const result = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: "products" },
//         (error, result) => {
//           if (error) reject(new ApiError(500, "Error uploading image"));
//           else resolve(result);
//         }
//       );
//       stream.end(req.file.buffer);
//     });

//     const product = await Product.create({
//       title,
//       slug: slugify(title, { lower: true }),
//       description,
//       quantity,
//       price,
//       category,
//       brand,
//       imageCover: result.secure_url
//     });

//     return res.status(201).json({
//       status: 'success',
//       data: product
//     });
//   }

//   // If no image provided at all
//   return next(new ApiError(400, "Product image is required"));
// });




// export const createProduct = catchAsync(async (req, res, next) => {
//   const { title, description, quantity, price, category, brand } = req.body;

//   if (!req.file) {
//     return next(new ApiError(400, "Product image is required"));
//   }

//   // Upload image to cloudinary
//   const result = await new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder: "products" },
//       (error, result) => {
//         if (error) reject(new ApiError(500, "Error uploading image"));
//         else resolve(result);
//       }
//     );
//     stream.end(req.file.buffer);
//   });

//   const product = await Product.create({
//     title,
//     slug: slugify(title, { lower: true }),
//     description,
//     quantity,
//     price,
//     category,
//     brand,
//     imageCover: result.secure_url
//   });

//   res.status(201).json({
//     status: 'success',
//     data: product
//   });
// });

// Get all products with filtering and pagination
export const getProducts = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.brand) filter.brand = req.query.brand;
  if (req.query.priceMin) filter.price = { $gte: req.query.priceMin };
  if (req.query.priceMax) filter.price = { ...filter.price, $lte: req.query.priceMax };

  const [products, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit),
    Product.countDocuments(filter)
  ]);

  res.status(200).json({
    status: 'success',
    results: products.length,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: products
  });
});

// Get single product
export const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: 'category',
      select: 'name -_id'
    });

  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});


// export const getProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findById(req.params.id)
//     .populate('reviews')
//     .populate('brand');

//   if (!product) {
//     return next(new ApiError(404, 'Product not found'));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: product
//   });
// });

// Update product
export const updateProduct = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  if (title) {
    req.body.slug = slugify(title, { lower: true });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});

// Delete product
export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully'
  });
});

// Search products
export const searchProducts = catchAsync(async (req, res) => {
  const { query } = req.query;
  
  const products = await Product.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  });

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products
  });
});

// Get featured products
export const getFeaturedProducts = catchAsync(async (req, res) => {
  const products = await Product.find({ featured: true })
    .limit(8)
    .populate('category');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products
  });
});

// Update product rating
export const updateProductRating = catchAsync(async (req, res, next) => {
  const { rating, message } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return next(new ApiError(404, 'Product not found'));
  }

  // Calculate new rating average
  const newRatingsQuantity = product.ratingsQuantity + 1;
  const newRatingsAverage = 
    (product.ratingsAverage * product.ratingsQuantity + rating) / newRatingsQuantity;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      ratingsAverage: newRatingsAverage,
      ratingsQuantity: newRatingsQuantity,
      $push: { 
        ratingMessages: {
          user: req.user._id,
          message,
          rating
        }
      }
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: updatedProduct
  });
});
