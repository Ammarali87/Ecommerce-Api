import Brand from "../models/BrandModel.js"
import slugify from "slugify";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

 


export const CreateBrand = async (req, res, next) => {
  try { 
    const { name } = req.body;
    if (!name) return next(new ApiError(400, "Category name is required"));
    if (!req.file) return next(new ApiError(400, "Image file is required"));

    let imageUrl = "";

    // 🔹 رفع الصورة باستخدام upload_stream
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "categories" },
        (error, result) => {
          if (error) reject(new ApiError(500, "Error uploading image"));
          else resolve(result);
        }
      );
      stream.end(req.file.buffer); // إرسال الصورة مباشرة
    });

    imageUrl = result.secure_url;

    const newCategory = await Category.create({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      image: imageUrl,
    });

    console.log("Created Brand:", newBrand);
    res.status(201).json({ status: "success", newBrand });
  } catch (error) {
    console.error("Error adding Brand:", error);
    next(new ApiError(500, "Error adding Brand"));
  }
};

export const getBrands = async (req, res, next) => {
  try {   // parseInt() or * 1 to make number
    const page = req.query.page *1  || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // ✅ جلب العدد الكلي للفئات
    const totalCount = await Brand.countDocuments();

    // ✅ تطبيق limit على الاستعلام
    const categories = await Brand.find().skip(skip).limit(limit);

    res.status(200).json({
      status: "success",
      result: categories.length,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount, 
      data: categories,
    });   // Math.ceil no ارقام عشرية 

  } catch (error) {
    console.error("Error fetching categories:", error);
    next(new ApiError(500, "Error fetching categories"));
  }
};


 
export const getOneBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Brand = await Brand.findById(id);

    if (!Brand) return next(new ApiError(404, "Brand not found"));

    res.status(200).json({ status: "success", Brand });
  } catch (error) {
    console.error("Error fetching Brand:", error);
    next(new ApiError(500, "Error fetching Brand"));
  }
};


// delete one
export const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const Brand = await Brand.findByIdAndDelete(id)
    // Brand.deleteOne({id})
     // or {_id:id}
    if (!Brand) return next(new ApiError(404, "Brand not Delete"));

    res.status(200).json({ status:
       "success Deleting", Brand });
  } catch (error) {
    console.error("Error Deleting Brand:", error);
    next(new ApiError(500, "Error updating Brand"));
  }
};


// update

// if cate is not option use
  // if (!Brand || !(await Brand.findById(Brand))) {
    export const updateBrand = catchAsync(async (req, res, next) => {
      const { id } = req.params;
      const { name } = req.body;
    
      const Brand = await Brand.findOneAndUpdate(
        { _id: id }, 
        { 
          name, 
          slug: slugify(name, { lower: true }) 
        },    
        { new: true } 
      );
    
      if (!Brand) return next(new ApiError(404, "Category not found"));
    
      res.status(200).json({ status: "success", category });
    });


