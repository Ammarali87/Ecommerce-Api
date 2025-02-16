import SubCategory from "../models/SubCategory.js";
import Category from "../models/Category.js"; // التحقق من وجود الفئة
import slugify from "slugify";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

// get Sub one/all need populate


// create

export const createSubCategory = catchAsync(async (req, res, next) => {
  const { name, category } = req.body;

  // ✅ التحقق من أن الاسم غير فارغ
  if (!name) return next(new ApiError(400, "Subcategory name is required"));

  // ✅ التحقق مما إذا كانت الفئة (Category) موجودة أم لا
  const existingCategory = 
  await Category.findById(category);
  if (!existingCategory) {
    return next(new ApiError(400, "Invalid category ID"));
  }

  // ✅ إنشاء الـ SubCategory بعد التحقق
  const newSubCategory = await SubCategory.create({
    name,
    slug: slugify(name, { lower: true, strict: true }),
    category,
  });

  res.status(201).json({
    status: "success",
    message: "Subcategory created successfully",
    data: newSubCategory,
  });
});

// get one
export const getSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await
   SubCategory
   .findById(id).populate("category");

   if (!subCategory) {
    return next(new ApiError(404, "Subcategory not found"));
  }

  res.status(200).json({
    status: "success",
    data: subCategory,
  });
});

// get all
export const getSubCategories = catchAsync(async (req, res) => {
  const subCategories = 
  await SubCategory.find()
  .populate("category");

  res.status(200).json({
    status: "success",
    results: subCategories.length,
    data: subCategories,
  });
});



// update
export const updateSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  // التحقق من أن الاسم غير فارغ
  if (!name) return next(new ApiError(400, "Subcategory name is required"));
 
   const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return next(new ApiError(400, "Invalid category ID"));
    }

  const updatedSubCategory =
   await SubCategory.findByIdAndUpdate(
    id,
    { name, slug: slugify(name, { lower: true, strict: true }), category },
    { new: true, runValidators: true }
  );    // runValidor for 
      // SubCate schema check

  if (!updatedSubCategory) {
    return next(new ApiError(404, "Subcategory not found"));
  }

  res.status(200).json({
    status: "success",
    message: "Subcategory updated successfully",
    data: updatedSubCategory,
  });   
});



// delete one
export const deleteSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

  if (!deletedSubCategory) {
    return next(new ApiError(404, "Subcategory not found"));
  }

  res.status(200).json({
    status: "success",
    message: "Subcategory deleted successfully",
  });
});