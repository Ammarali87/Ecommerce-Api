import Category from '../models/categoryModel.js';
import slugify from 'slugify';


// Add Category Function
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ status: 'fail', message: 'Category name is required' });
    }

    const newCategory = new Category({
      name,
      slug: slugify(name),  // Create a slug from the name
    });

    await newCategory.save();
    res.status(201).json({ status: 'success', newCategory });
  } catch (error) {
    console.log('Error adding category:', error);
    res.status(500).json({ status: 'error', message: 'Error adding category' });
  }
};






// Get Categories Function
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ status: 'success', categories });
  } catch (error) {
    console.log('Error fetching categories:', error);
    res.status(500).json({ status: 'error', message: 'Error fetching categories' });
  }
};
