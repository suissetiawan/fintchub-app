const { Category, Transaction, Budget } = require('../models');

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

const { Op } = require('sequelize');

const createCategory = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    
    // Validate uniqueness
    const existing = await Category.findOne({
      where: { name }
    });
    if (existing) {
      return res.status(400).json({ message: 'Kategori dengan nama ini sudah ada.' });
    }

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

    // Validate uniqueness
    const existing = await Category.findOne({
      where: { name, id: { [Op.ne]: id } }
    });
    if (existing) {
      return res.status(400).json({ message: 'Kategori dengan nama ini sudah ada.' });
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

    const transactionCount = await Transaction.count({ where: { categoryId: id } });
    const budgetCount = await Budget.count({ where: { categoryId: id } });

    if (transactionCount > 0 || budgetCount > 0) {
      return res.status(400).json({ 
        message: 'Kategori ini tidak dapat dihapus karena masih digunakan pada transaksi atau budget Anda.' 
      });
    }

    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        message: 'Kategori ini tidak dapat dihapus karena masih digunakan pada transaksi atau budget Anda.' 
      });
    }
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
