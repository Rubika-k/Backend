import Category from '../models/Category.js';

// Admin: Add new category
export const addCategory = async (req, res) => {
  try {
    const { name, icon, description, image, workers } = req.body;

    // Check if category with this name already exists
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      icon,
      description,
      image,
      workers: Number(workers) || 0  // Make sure workers is a number
    });

    await category.save();
    res.status(201).json(category);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// Public: Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Admin: Delete category
export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
