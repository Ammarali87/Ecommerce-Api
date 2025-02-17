import SubCategory from "../models/SubCategoriesModel.js"
import Category from "../models/categoryModel.js"; // التحقق من وجود الفئة
import slugify from "slugify";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";


// create


export const createSubCategory = catchAsync(async (req, res, next) => {
  const { name, categoryId } = req.body;

  // ✅ Use categoryId from body or params (for nested routes)
  const category = categoryId
   || req.params.categoryId;

  // ✅ Check if category exists
  if (!category) {
    return next(new ApiError(400, 
      "Category ID is required"));
  }  // ما عبا
  const existingCategory = await
   Category.findById(category);
  if (!existingCategory) {
    return next(new ApiError(400, 
      "Invalid category ID"));
  }   //   عبا غلط

  // ✅ Create the subcategory
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name, { lower: true, strict: true }),
    category,
  });

  
  await subCategory.populate("category", "name _id");

  res.status(201).json({
    status: "success",
    message: "Subcategory created successfully",
    // data: subCategory, or
    data: {
      id: subCategory._id,
      name: subCategory.name,
      slug: subCategory.slug,
      category: {
        id: subCategory.category._id,
        name: subCategory.category.name
      }
    }
  });
});


export const getSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id)
    // .populate("category") // ✅ إرجاع بيانات الفئة المرتبطة
    // .lean(); // ✅ تحسين الأداء بإرجاع كائن JavaScript عادي

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
  const subCategories = await SubCategory.find()
    .populate({ path: "category", select: "name -_id" }) // ✅ جلب اسم الفئة فقط بدون `_id`
    .lean(); // ✅ تحسين الأداء

  res.status(200).json({
    status: "success",
    results: subCategories.length,
    data: subCategories,
  });
});
 


// delete one
export const deleteSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedSubCategory = await SubCategory.findByIdAndDelete(id).lean(); // ✅ تحسين الأداء

  if (!deletedSubCategory) {
    return next(new ApiError(404, "Subcategory not found"));
  }

  res.status(200).json({
    status: "success",
    message: "Subcategory deleted successfully",
  });
});

// update

export const updateSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  
  // 1. First check if name is provided
  if (!name) {
    return next(new ApiError(400, "Subcategory name is required"));
  }

  // 2. Prepare update object
  const updateData = {
    name,
    slug: slugify(name, { lower: true, strict: true })
  };  
   
  // 3. If category is provided, validate it
  if (category) {
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return next(new ApiError(400, "Invalid category ID"));
    }
    updateData.category = category;
  } 

  // 4. Update subcategory
  const updatedSubCategory = await SubCategory.findByIdAndUpdate(
    id,
    updateData,
    { 
      new: true, 
      runValidators: true 
    }
  ).populate('category');

  if (!updatedSubCategory) {
    return next(new ApiError(404, "Subcategory not found"));
  }

  res.status(200).json({
    status: "success",
    message: "Subcategory updated successfully",
    updatedSubCategory
  });
});
