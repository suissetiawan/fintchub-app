const { Category, Transaction, Budget } = require('../models');
const { seedStarterCategories } = require('../services/categoryService');
const { Op } = require('sequelize');

const getAllCategories = async (req, res) => {
  try {
    // Check if user has any personal categories
    const userCategoryCount = await Category.count({
      where: { userId: req.user.id }
    });

    // If no personal categories, seed them (for existing users)
    if (userCategoryCount === 0) {
      await seedStarterCategories(req.user.id);
    }

    // Categories are shared (userId is null) or specific to user
    const categories = await Category.findAll({
      where: {
        [Op.or]: [
          { userId: null },
          { userId: req.user.id }
        ]
      }
    });
    res.json({ response: categories });
  } catch (error) {
    console.error('Fetch categories error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

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

    // Authorization: Admin or Owner
    if (req.user.role !== 'ADMIN' && category.userId !== req.user.id) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses untuk mengubah kategori ini.' });
    }

    // Validate uniqueness (excluding current)
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

    // Authorization: Admin or Owner
    if (req.user.role !== 'ADMIN' && category.userId !== req.user.id) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses untuk menghapus kategori ini.' });
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
