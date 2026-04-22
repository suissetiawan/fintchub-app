const { Category } = require('../models');

const getAllCategories = async (req, res) => {
  try {
    // Categories are shared or specific to user? 
    // In many apps, categories are global, but let's make them global for now as seen in UI (no user filtering in the fetch categories call).
    // Actually, UI says admin can manage them.
    const categories = await Category.findAll();
    res.json({ response: categories });
  } catch (error) {
    console.error('Fetch categories error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    const category = await Category.create({
      name,
      description,
      type: type || 'EXPENSE',
      userId: req.user.id,
    });
    res.status(201).json({ message: 'Category created', response: category });
  } catch (error) {
    console.error('Create category error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type } = req.body;
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.update({ name, description, type });
    res.json({ message: 'Category updated', response: category });
  } catch (error) {
    console.error('Update category error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Delete category error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
