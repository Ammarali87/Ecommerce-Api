import Category from '../models/categoryModel.js';
import slugify from 'slugify';
import ApiError from '../utils/ApiError.js';
import fuzzysearch from "fuzzysearch";
// i hate next() await async
// also res.status.json({status:"success" , message:" ", result })
// most hate try-catch to get global error 

// Add Category Function
export const addCategory = async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
           status: 'fail', message: 'Category name is required' });
      }
  
      const newCategory = await Category.create({
   name,slug:slugify(name, { lower:true , strict:true }) })
  
      res.status(201).json({ status: 'success', newCategory });
    } catch (error) {  
      console.error('Error adding category:', error); // More detailed logging
      // return res.status(500).json({ status: 'error', message: error.message || 'Error adding category' });
     return next(new ApiError(500 , "error add category"))
    }
  };
  



// Get Categories Function
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ status: 'success', categories });
  } catch (error) {
    console.log('Error fetching categories:', error);
    // res.status(500).json({ status: 'error', message: 'Error fetching categories' });
return next(new ApiError(500, 'Error fetching categories')); // 👈 Send to error middleware

  }
};



 
 // Get category name from URL params

export const getOneCategory = async (req, res, next) => {
  try {
    const { name } = req.params; // Get category name from URL params

    const category = await Category.findOne({ name: name }); // Find by name

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
    const query = req.query.q;
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
