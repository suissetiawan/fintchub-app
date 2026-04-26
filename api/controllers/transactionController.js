const { Transaction, Category, Sequelize } = require('../models');
const { Op } = Sequelize;

/** 
 * Gets all transactions with formatting, pagination, and summary as expected by Frontend v2
 */
const getAllTransactions = async (req, res) => {
  try {
    const { month, year, startDate, endDate, page = 1, size = 10 } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    const where = { userId: req.user.id };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    } else if (month && year) {
      where.date = {
        [Op.like]: `${year}-${month}%`,
      };
    } else if (month) {
      // Handle legacy format or single param
      where.date = {
        [Op.like]: `${month}%`,
      };
    }

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['name', 'type'] }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      limit,
      offset,
    });

    // Calculate summary for the filtered period
    const allTransactionsInPeriod = await Transaction.findAll({ 
      where,
      include: [{ model: Category, as: 'category', attributes: ['name'] }]
    });
    let income = 0;
    let expense = 0;
    const categoryBreakdown = {};

    allTransactionsInPeriod.forEach(t => {
      const amt = parseFloat(t.amount);
      if (t.type === 'INCOME') {
        income += amt;
      } else {
        expense += amt;
        const catName = t.category ? t.category.name : 'Uncategorized';
        categoryBreakdown[catName] = (categoryBreakdown[catName] || 0) + amt;
      }
    });

    const formattedTransactions = transactions.map((t) => ({
      ...t.toJSON(),
      category: t.category ? t.category.name : 'Uncategorized',
    }));

    res.json({
      response: formattedTransactions,
      summary: { income, expense },
      categoryBreakdown,
      pagination: {
        page: parseInt(page),
        size: limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Fetch transactions error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { description, amount, type, date, categoryId } = req.body;

    // Validate uniqueness
    const existing = await Transaction.findOne({
      where: {
        userId: req.user.id,
        description,
        amount,
        type,
        date,
        categoryId: categoryId || null
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'Transaksi dengan rincian yang sama sudah ada.' });
    }

    const transaction = await Transaction.create({
      description,
      amount,
      type,
      date,
      categoryId,
      userId: req.user.id,
    });
    res.status(201).json({ message: 'Transaction created', response: transaction });
  } catch (error) {
    console.error('Create transaction error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type, date, categoryId } = req.body;
    const transaction = await Transaction.findOne({
      where: { id, userId: req.user.id },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Validate uniqueness
    const existing = await Transaction.findOne({
      where: {
        userId: req.user.id,
        description,
        amount,
        type,
        date,
        categoryId: categoryId || null,
        id: { [Op.ne]: id }
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'Transaksi dengan rincian yang sama sudah ada.' });
    }

    await transaction.update({
      description,
      amount,
      type,
      date,
      categoryId,
    });

    res.json({ message: 'Transaction updated', response: transaction });
  } catch (error) {
    console.error('Update transaction error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({
      where: { id, userId: req.user.id },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.destroy();
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Delete transaction error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({
      where: { id, userId: req.user.id },
      include: [{ model: Category, as: 'category', attributes: ['name', 'type'] }],
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const formatted = {
      ...transaction.toJSON(),
      category: transaction.category ? transaction.category.name : 'Uncategorized',
    };

    res.json({ response: formatted });
  } catch (error) {
    console.error('Fetch transaction detail error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/** Shared colors for the breakdown chart */
const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1'
];

const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    const transactions = await Transaction.findAll({ where: { userId } });

    let totalIncome = 0;
    let totalExpense = 0;
    let monthlyExpense = 0;
    let dailySpending = 0;

    const today = new Date();
    const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    const currentMonthStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');

    transactions.forEach((t) => {
      const amt = parseFloat(t.amount);
      if (t.type === 'INCOME') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
        
        if (startDate && endDate) {
          if (t.date >= startDate && t.date <= endDate) {
            monthlyExpense += amt;
          }
        } else if (t.date && t.date.startsWith(currentMonthStr)) {
          monthlyExpense += amt;
        }

        if (t.date && t.date.startsWith(todayStr)) {
          dailySpending += amt;
        }
      }
    });

    res.json({
      response: {
        balance: totalIncome - totalExpense,
        income: totalIncome,
        expense: monthlyExpense,
        dailySpending
      }
    });
  } catch (error) {
    console.error('Dashboard summary error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDashboardBreakdown = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const where = { userId, type: 'EXPENSE' };
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    const transactions = await Transaction.findAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
    });

    const categoryTotals = {};
    transactions.forEach((t) => {
      const amt = parseFloat(t.amount);
      const catName = t.category ? t.category.name : 'Uncategorized';
      categoryTotals[catName] = (categoryTotals[catName] || 0) + amt;
    });

    const response = Object.keys(categoryTotals).map((cat, index) => ({
      category: cat,
      amount: categoryTotals[cat],
      color: COLORS[index % COLORS.length]
    }));

    res.json({ response });
  } catch (error) {
    console.error('Dashboard breakdown error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
  getDashboardSummary,
  getDashboardBreakdown
};
