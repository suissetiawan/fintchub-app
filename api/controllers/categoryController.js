const { Category, Transaction, Budget } = require('../models');
const { seedStarterCategories } = require('../services/categoryService');
const { Op } = require('sequelize');

const getAllCategories = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';

    // Categories query
    const whereClause = isAdmin 
      ? {} // Admin sees everything
      : {
          [Op.or]: [
            { userId: null },
            { userId: req.user.id }
          ]
        };

    const categories = await Category.findAll({
      where: whereClause,
      include: isAdmin ? [{
        model: require('../models').User,
        as: 'user',
        attributes: ['id', 'username', 'name']
      }] : []
    });

    res.json({ response: categories });
  } catch (error) {
    console.error('Fetch categories error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, type, userId } = req.body;
    const isAdmin = req.user.role === 'ADMIN';
    
    // Validate uniqueness
    // For Global (userId null), name must be unique among all Global categories
    // For Personal, name must be unique for THAT user
    const targetUserId = isAdmin ? (userId === undefined ? null : userId) : req.user.id;

    const existing = await Category.findOne({
      where: { 
        name,
        userId: targetUserId
      }
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Kategori dengan nama ini sudah ada untuk target kepemilikan tersebut.' });
    }

    const category = await Category.create({
      name,
      description,
      type: type || 'EXPENSE',
      userId: targetUserId,
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
    const { name, description, type, userId } = req.body;
    const isAdmin = req.user.role === 'ADMIN';
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Authorization: Admin or Owner
    if (!isAdmin && category.userId !== req.user.id) {
      return res.status(403).json({ message: 'Anda tidak memiliki akses untuk mengubah kategori ini.' });
    }

    const targetUserId = isAdmin ? (userId === undefined ? category.userId : userId) : category.userId;

    // Validate uniqueness (excluding current)
    const existing = await Category.findOne({
      where: { 
        name, 
        userId: targetUserId,
        id: { [Op.ne]: id } 
      }
    });
    if (existing) {
      return res.status(400).json({ message: 'Kategori dengan nama ini sudah ada untuk target kepemilikan tersebut.' });
    }

    await category.update({ 
      name, 
      description, 
      type,
      userId: targetUserId
    });
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
