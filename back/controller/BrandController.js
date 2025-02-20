import Brand from "../models/BrandModel.js";
import slugify from "slugify";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import cloudinary from "../config/cloudinaryConfig.js";



export const CreateBrand = async (req, res, next) => {
  try { 
    const { name } = req.body;
    if (!name) return next(new ApiError(400, "Brand name is required"));
    if (!req.file) return next(new ApiError(400, "Image file is required"));

    let imageUrl = "";

    // رفع الصورة إلى Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "brands" },
        (error, result) => {
          if (error) reject(new ApiError(500, "Error uploading image"));
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    imageUrl = result.secure_url;

    const newBrand = await Brand.create({
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

// جلب جميع العلامات التجارية مع التصفية والتقسيم إلى صفحات
export const getBrands = async (req, res, next) => {
  try {  
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalCount = await Brand.countDocuments();
    const brands = await Brand.find().skip(skip).limit(limit);

    res.status(200).json({
      status: "success",
      result: brands.length,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount, 
      data: brands,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    next(new ApiError(500, "Error fetching brands"));
  }
};

// جلب علامة تجارية واحدة
export const getOneBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);

    if (!brand) return next(new ApiError(404, "Brand not found"));

    res.status(200).json({ status: "success", brand });
  } catch (error) {
    console.error("Error fetching Brand:", error);
    next(new ApiError(500, "Error fetching Brand"));
  }
};

// حذف علامة تجارية
export const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) return next(new ApiError(404, "Brand not found"));

    res.status(200).json({ status: "success", message: "Brand deleted successfully", brand });
  } catch (error) {
    console.error("Error Deleting Brand:", error);
    next(new ApiError(500, "Error deleting Brand"));
  }
};

// تحديث علامة تجارية
export const updateBrand = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findOneAndUpdate(
    { _id: id }, 
    { 
      name, 
      slug: slugify(name, { lower: true }) 
    },    
    { new: true } 
  );

  if (!brand) return next(new ApiError(404, "Brand not found"));

  res.status(200).json({ status: "success", brand });
});
