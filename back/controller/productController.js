import Product from '../models/ProductModel.js';
import Category from '../models/CategoryModel.js';
import slugify from 'slugify';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import cloudinary from "../config/cloudinaryConfig.js";

  // after update and Delete make if (!product) {
    // return next(new ApiError(404, 'Product not found'));
  // }


// Create new product

export const createProduct = catchAsync(async (req, res, next) => {
  // 1. Get all fields from request body
  const productData = { ...req.body };
  
  // 2. Generate slug from title
  if (productData.title) {
    productData.slug = slugify(productData.title, { lower: true });
  }

  // 3. Create product
  const product = await Product.create(productData);

  // 4. Check if product was created
  if (!product) {
    return next(new ApiError(404, 'Product not Created'));
  }

  // 5. Send response
  res.status(201).json({
    status: 'success',
    data: product
  });
});
// export const createProduct = catchAsync(async (req, res, next) => {
//   const { title, description, quantity, price, category, brand, imageCover } = req.body;

//   // move existCategory to Vaildate middware 

//   // Remove the image URL concatenation
//   const product = await Product.create({
//     title,
//     slug: slugify(title, { lower: true }),
//     description,
//     quantity,
//     price,
//     category,
//     brand,
//     imageCover // Use the image URL directly
//   });
//    // optional 
//   if (!product) {
//     return next(new ApiError(404, 'Product not Created'));
//   }
//   return res.status(201).json({
//     status: 'success',
//     data: product
//   });
// });


export const getProducts = catchAsync(async (req, res) => {
  let { 
    page = 1, 
    limit = 12, 
    sort, 
    rating,
    ratingMin,
    ratingMax,
    ...filters 
  } = req.query;

  // Convert pagination params to numbers
  page = parseInt(page);
  limit = parseInt(limit);
  const skip = (page - 1) * limit;

  // Build filter object
  const filterObject = { ...filters };

  // Handle rating filters
  if (rating) {
    // For exact rating, use a range of ±0.4 to catch nearby ratings
    filterObject.ratingsAverage = {
      $gte: parseFloat(rating) - 0.4,
      $lte: parseFloat(rating) + 0.4
    };
  } else if (ratingMin || ratingMax) {
    filterObject.ratingsAverage = {};
    if (ratingMin) filterObject.ratingsAverage.$gte 
    = parseFloat(ratingMin);
    if (ratingMax) filterObject.ratingsAverage.$lte = parseFloat(ratingMax);
  }

  // Build query
  let query = Product.find(filterObject)
    .skip(skip)
    .limit(limit)
    .populate('category', 'name -_id');

  // Add sorting
  if (sort) {
    query = query.sort(sort.replace(/,/g, ' '));
  } else {
    query = query.sort('-createdAt');
  }

  // Debug log
  console.log('Filter Object:', filterObject);

  // Execute query
  const [products, total] = await Promise.all([
    query,
    Product.countDocuments(filterObject)
  ]);

  res.status(200).json({
    status: "success",
    results: products.length,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
    data: products
  });
});

// export const getProducts = catchAsync(async (req, res) => {
//   // 1. Get query parameters with defaults
//   let { 
//     page = 1,              // Current page
//     limit = 12,            // Products per page
//     sort,                  // Sorting criteria
//     priceMin,             // Minimum price filter
//     priceMax,             // Maximum price filter
//     rating,               // Exact rating filter
//     ...filters            // Any other filters
//   } = req.query;

//   // 2. Convert pagination params to numbers
//   page = parseInt(page);
//   limit = parseInt(limit);
//   const skip = (page - 1) * limit;
 
//   // 3. Build filter object
//   const filterObject = { ...filters };

//   // Add price range filter if provided
//   if (priceMin || priceMax) {
//     filterObject.price = {};
//     if (priceMin) filterObject.price.$gte = parseFloat(priceMin);
//     if (priceMax) filterObject.price.$lte = parseFloat(priceMax);
//   }

//   // Add rating filter if provided
//   if (rating) {
//     filterObject.ratingsAverage = parseFloat(rating);
//   }

//   // 4. Build query
//   let query = Product.find(filterObject)
//     .skip(skip)
//     .limit(limit)
//     .populate('category', 'name -_id'); // Populate category details

//   // 5. Add sorting
//   if (sort) {
//     // Convert "price,-createdAt" to "price -createdAt"
//     query = query.sort(sort.replace(/,/g, ' '));
//   } else {
//     // Default sort by newest
//     query = query.sort('-createdAt');
//   }

//   // 6. Execute query and get total count
//   const [products, total] = await Promise.all([
//     query,
//     Product.countDocuments(filterObject)
//   ]);

//   // 7. Send response
//   res.status(200).json({
//     status: "success",
//     results: products.length,
//     totalPages: Math.ceil(total / limit),
//     currentPage: page,
//     total,
//     data: products
//   });
// });

// export const getProducts = catchAsync(async (req, res) => {
//   let { page = 1, limit = 10, sort, 
//     fields, priceMin, priceMax,
//     ratingMin,rating,ratingMax, ...filters } = req.query;

//   page = page *1 || 1;
//   limit = limit *1 || 10;
//   const skip = (page - 1) * limit;
//   //  only skip is const 

//   // معالجة نطاق السعر إذا كان موجودًا
//   if (priceMin || priceMax) {
//     filters.price = {};  // intial price objet
//     if (priceMin) filters.price.$gte = priceMin *1 ; 
//     // السعر أكبر من أو يساوي priceMin
//     if (priceMax) filters.price.$lt = priceMax *1;
//       // السعر أقل من priceMax فقط
//   }
//   if (ratingMin || ratingMax) {
//     filters.rating = {};  // intial rating objet
//     if (ratingMin) filters.rating.$gte = ratingMin *1 ; 
//     // السعر أكبر من أو يساوي ratingMin
//     if (ratingMax) filters.rating.$lt = ratingMax *1;
//       // السعر أقل من priceMax فقط
//   }
  
//   // Handle rating filtering
//   //     $gte: ratingMin * 1
// //   if (ratingMin) {
// //     filters.ratingsAverage = {
// //     $gte: parseFloat(ratingMin) || 0
// //   };
// // }
// // if (rating) {
// //   filters.ratingsAverage = rating * 1;
// // }

//   //  find(filters)
//   let query = Product.find(filters).skip(skip).limit(limit);
//    // لوموجودة ترتيب  ووضع ,,,,,
//   //  ?sort=price,-createdAt
//   //  query.sort("price -createdAt");
//   if (sort) query = query.sort(sort.split(",").join(" "));
//   if (fields) query = query.select(fields.split(",").join(" "));
//   // query.select("name price category");

//   const [products, total] = await Promise.all([
//     query,
//     Product.countDocuments(filters),
//   ]);  
//   //  .populate({path:"category",select:"name - _id"})
//   res.status(200).json({
//     status: "success",
//     results: products.length,
//     totalPages: Math.ceil(total / limit),
//     currentPage: page,
//     data: products,
//   });
// });


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
