import SubCategory from "../models/SubCategoriesModel.js"
import Category from "../models/CategoryModel.js"; // التحقق من وجود الفئة
import slugify from "slugify";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

 


export const createSubCategory = catchAsync(async (req, res, next) => {
  const { name, categoryId } = req.body;
  const category = categoryId || req.params.categoryId;

  // Check if category exists
  if (!category || !await Category.findById(category)) {
    return next(new ApiError(400, "Invalid category ID"));
  }

  // Create subcategory
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name, { lower: true, strict: true }),
    category,
  });

  res.status(201).json({
    status: "success",
    message: "Subcategory created successfully",
    data: {
      id: subCategory._id,
      name: subCategory.name,
      slug: subCategory.slug,
      category: {
        id: subCategory.category
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

// get all use empty find()
export const getSubCategories = catchAsync(async (req, res) => {
  const subCategories = await SubCategory.find()
    // .populate("category", "name _id" )
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

// if cate is not option use
  // if (!category || !(await Category.findById(category))) {

  export const updateSubCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, category } = req.body;
  
    if (!name) return next(new ApiError(400, "Subcategory name is required"));
  
    const updateData = { 
      name, 
      slug: slugify(name, { lower: true, strict: true }) 
    };
  
    // ✅ التحقق من صحة `category` فقط إذا تم إرساله
    if (category && !(await Category.exists({ _id: category }))) {
      return next(new ApiError(400, "Invalid category ID"));
    }
    updateData.category = category;
    
  
    // ✅ تحديث الفئة الفرعية
    const updatedSubCate = await SubCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    // .populate("category", "name _id"); // ✅ جلب بيانات الفئة المرتبطة
  
    if (!updatedSubCate) return next(new ApiError(404, "Subcategory not found"));
  
    res.status(200).json({
      status: "success",
      message: "Subcategory updated successfully",
      data: {
        id: updatedSubCate._id,
        name: updatedSubCate.name,
        slug: updatedSubCate.slug,
        category: updatedSubCate.category // ✅ إرجاع الفئة ككائن بدلاً من الـ ID فقط
      }
    });
  });
  


