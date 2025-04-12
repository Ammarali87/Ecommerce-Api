import Category from '../models/categoryModel.js';
import { getAll, getOne, createOne, deleteOne, updateOne } from './handlersFactory.js';

export const getAllCategories = getAll(Category, 'Category');
export const getCategory = getOne(Category, { path: 'reviews' });
export const createCategory = createOne(Category);
export const updateCategory = updateOne(Category);
export const deleteCategory = deleteOne(Category);




// import Category from '../models/categoryModel.js';
// import slugify from 'slugify';
// import ApiError from '../utils/ApiError.js';
// import fuzzysearch from "fuzzysearch";
// import cloudinary from "../config/cloudinaryConfig.js";
// import catchAsync from '../utils/catchAsync.js';

// //  catchAsync use 

// export const addCategory = async (req, res, next) => {
//   try { 
//     const { name } = req.body;
//     if (!name) return next(new ApiError(400, "Category name is required"));
//     if (!req.file) return next(new ApiError(400, "Image file is required"));

    
//     let imageUrl = "";

//     // 🔹 رفع الصورة باستخدام upload_stream
//     const result = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: "categories" },
//         (error, result) => {
//           if (error) reject(new ApiError(500, "Error uploading image"));
//           else resolve(result);
//         }
//       );
//       stream.end(req.file.buffer); // إرسال الصورة مباشرة
//     });

//     imageUrl = result.secure_url;

//     const newCategory = await Category.create({
//       name,
//       slug: slugify(name, { lower: true, strict: true }),
//       image: imageUrl,
//     });

//     console.log("Created Category:", newCategory);
//     res.status(201).json({ status: "success", newCategory });
//   } catch (error) {
//     console.error("Error adding category:", error);
//     next(new ApiError(500, "Error adding category"));
//   }
// };


// export const getCategories = async (req, res, next) => {
//   try {   // parseInt() or * 1 to make number
//     const page = req.query.page *1  || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const skip = (page - 1) * limit;

//     // ✅ جلب العدد الكلي للفئات
//     const totalCount = await Category.countDocuments();

//     // ✅ تطبيق limit على الاستعلام
//     const categories = await Category.find().skip(skip).limit(limit);

//     res.status(200).json({
//       status: "success",
//       result: categories.length,
//       page,
//       totalPages: Math.ceil(totalCount / limit),
//       totalCount, 
//       data: categories,
//     });   // Math.ceil no ارقام عشرية 

//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     next(new ApiError(500, "Error fetching categories"));
//   }
// };


// //     const [categories, totalCount] = await Promise.all([
// //       Category.find().skip(skip).limit(limit),
// //       Category.countDocuments()
// //     ]);




// // ✅ تحسين getOneCategory
// export const getOneCategory = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const category = await Category.findById(id);

//     if (!category) return next(new ApiError(404, "Category not found"));

//     res.status(200).json({ status: "success", category });
//   } catch (error) {
//     console.error("Error fetching category:", error);
//     next(new ApiError(500, "Error fetching category"));
//   }
// };




// export const updateCategory = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   const category = await Category.findOneAndUpdate(
//     { _id: id }, 
//     { 
//       name, 
//       slug: slugify(name, { lower: true }) 
//     },    
//     { new: true } 
//   );

//   if (!category) return next(new ApiError(404, "Category not found"));

//   res.status(200).json({ status: "success", category });
// });




//  // delete category
//  export const deleteCategory = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const category = await Category.findByIdAndDelete(id)
//     // Category.deleteOne({id})
//      // or {_id:id}
//     if (!category) return next(new ApiError(404, "Category not Delete"));

//     res.status(200).json({ status:
//        "success Deleting", category });
//   } catch (error) {
//     console.error("Error Deleting category:", error);
//     next(new ApiError(500, "Error updating category"));
//   }
// };



// // ✅ تحسين البحث
// export const searchCategories = async (req, res, next) => {
//   try {
//     const { query } = req.query;
//     if (!query) return next(new ApiError(400, "Search query is required"));

//     const categories = await Category.find({
//       name: { $regex: query, $options: "i" },
//     });

//     res.status(200).json({ status: "success", categories });
//   } catch (error) {
//     console.error("Error searching categories:", error);
//     next(new ApiError(500, "Error searching categories"));
//   }
// };

// // ✅ تحسين البحث بالتقريب fuzzy search
// export const theFuzzySearch = async (req, res, next) => {
//   try {
//     const { query } = req.query;
//     if (!query) return next(new ApiError(400, "Search query is required"));

//     const allCategories = await Category.find();
//     const filtered = allCategories.filter((cate) =>
//       fuzzysearch(query.toLowerCase(), cate.name.toLowerCase())
//     );

//     res.status(200).json({ status: "success", categories: filtered });
//   } catch (error) {
//     console.error("Error searching categories:", error);
//     next(new ApiError(500, "Error searching categories"));
//   }
// };