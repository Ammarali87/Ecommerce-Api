import Category from './models/CategoryModel';

// addCategory
const addCategory = async () => {
  try {
    const newCategory = new Category({
      name: 'Technology',
      description: 'This category contains tech-related products.',
    });

    await newCategory.save();
    console.log('Category Added:', newCategory);
    res.status(200).json({status:"success",newCategory})
  } catch (error) {
    console.log('Error adding category:', error);
  }
};

addCategory();


// getCategories

const getCategories = async () => {
    try {
      const categories = await Category.find();
      console.log('Categories:', categories);
    res.status(200).json({status:"success",categories})

    } catch (error) {
      console.log('Error fetching categories:', error);
    }
  };
  
  getCategories();
  
