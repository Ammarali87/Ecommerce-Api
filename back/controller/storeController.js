import Category from '../models/categoryModel.js';
import slugify from 'slugify';
import ApiError from '../utils/ApiError.js';
import fuzzysearch from "fuzzysearch";
import cloudinary from "../config/cloudinaryConfig.js";
// import { v2 as cloudinary } from "cloudinary";
// findOne/ById 
// const {name,id} = req.params
// const {query} = req.query
// Category.find({
  // name: { $regex: query, $options: 'i' }
  
// i hate next() await async
// also res.status.json({status:"success" , message:" ", result })
// most hate try-catch to get global error 

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
 
  // const {name} = req.body   to create
  // const {name} = req.params  to get

export const addCategory = async (req, res) => {
  try { 
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    let imageUrl = "";

    const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {  // callback
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);  // == res.end()
         // إرسال الصورة مباشرةً بدون حفظ علي سيرفر
      });   

      imageUrl = result.secure_url;
     
    const newCategory = await Category.create({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      image: imageUrl,
    }); 

    console.log("Created Category:", newCategory); // ✅ تأكد أن الصورة مرفوعة
    res.status(201).json({ status: "success", newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Error adding category" });
  }
};







// Get Categories Function
export const getCategories = async (req, res) => {
  const page = req.body.query * 1 || 1 ;
   // *1 conv num to string
  const limit = req.body.query * 1 || 5
  //wrong.body.limit 
  const skip = (page-1)*limit ; 

  try { 
    const categories = await 
    Category.find().skip(skip).limit(limit);
    res.status(200).json({ status: 'success',
      result: categories.length ,page ,data: categories });
  } catch (error) {
    console.log('Error fetching categories:', error);
    // res.status(500).json({ status: 'error', message: 'Error fetching categories' });
return next(new ApiError(500, 'Error fetching categories')); // 👈 Send to error middleware

  }
};



 
 // Get category name from URL params

export const getOneCategory = async (req, res, next) => {
  try {
    const { id } = req.params; //like id from params
    const category = await Category.findById(id);  

    if (!category) {
      return next(new ApiError(404, 'Category not found'));
    }

    res.status(200).json({ status: 'success', category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return next(new ApiError(500, 'Error fetching category'));
  }
};


// searchCategories by query

export const searchCategories = async (req, res, next) => {
  try {
    const { query } = req.query; // Get search query from URL (e.g., ?query=phones)
 
    if (!query) {
      return next(new ApiError(400, 'Search query is required'));
    }

    // Find categories where 'name' matches the search query (case-insensitive)
    const categories = await Category.find({
      name: { $regex: query, $options: 'i' },
// this default in mongoDB I not 1, qury not name 
    }); 

    res.status(200).json({ status: 'success', categories });
  } catch (error) {
    console.error('Error searching categories:', error);
    return next(new ApiError(500, 'Error searching categories'));
  }
};

 



//  fuzzysearch with filter and fuzz
// fuzzysearch(whatSearch,matchTo) category.name
export const theFuzzySearch = async (req, res, next) => {
  try { 
    const query = req.query ;
    if (!query) {
      return res.status(400).json({ status: "fail", message: "Search query is required" });
    }

    const allCategories = await Category.find();
     // Get all categories
    const filtered = allCategories
    .filter((cate) => fuzzysearch
    (query.toLowerCase(), cate.name.toLowerCase()));

    res.status(200).json({ status: "success", categories: filtered });
  } catch (error) {
    console.error("Error searching categories:", error);
    next(error);
  }
};
 
// cat.name.tolower Converts category names to
//  lowercase for case-insensitive search.
// query.toLowerCase()	Converts user input
//  to lowercase for better matching.



  // alt to fuzzy 
// import stringSimilarity from "string-similarity";

// const filtered = allCategories.filter((cat) => {
//   const similarity = stringSimilarity.compareTwoStrings(query.toLowerCase(), cat.name.toLowerCase());
//   return similarity > 0.6; // Adjust threshold for better results
// });
