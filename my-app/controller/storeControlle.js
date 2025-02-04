import Category from '../models/categoryModel.js';
import slugify from 'slugify';
import ApiError from '../utils/ApiError.js';


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




export const searchCategories = async (req, res, next) => {
  try {
    const { query } = req.query; // Get search query from URL (e.g., ?query=phones)

    if (!query) {
      return next(new ApiError(400, 'Search query is required'));
    }

    // Find categories where 'name' matches the search query (case-insensitive)
    const categories = await Category.find({
      name: { $regex: query, $options: 'i' }, // 'i' makes it case-insensitive
    });

    res.status(200).json({ status: 'success', categories });
  } catch (error) {
    console.error('Error searching categories:', error);
    return next(new ApiError(500, 'Error searching categories'));
  }
};
