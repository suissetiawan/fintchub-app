const { Budget, Category } = require('../models');

const getAllBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const where = { userId: req.user.id };

    if (month) where.month = month;
    if (year) where.year = year;

    const budgets = await Budget.findAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
      order: [['year', 'DESC'], ['month', 'DESC']]
    });

    // Format for UI (include categoryName as a flat field)
    const formattedBudgets = budgets.map(b => ({
      ...b.toJSON(),
      categoryName: b.category ? b.category.name : 'Unknown'
    }));

    res.json({ response: formattedBudgets });
  } catch (error) {
    console.error('Fetch budgets error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createBudget = async (req, res) => {
  try {
    const { categoryId, amount, month, year } = req.body;

    // Check if budget already exists for this category/month/year
    const existingBudget = await Budget.findOne({
      where: {
        userId: req.user.id,
        categoryId,
        month,
        year
      }
    });

    if (existingBudget) {
      return res.status(400).json({ message: 'Budget already exists for this category in the selected period' });
    }

    const budget = await Budget.create({
      categoryId,
      amount,
      month,
      year,
      userId: req.user.id
    });

    res.status(201).json({ message: 'Budget created', response: budget });
  } catch (error) {
    console.error('Create budget error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, month, year, categoryId } = req.body;

    const budget = await Budget.findOne({
      where: { id, userId: req.user.id }
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await budget.update({
      amount,
      month,
      year,
      categoryId
    });

    res.json({ message: 'Budget updated', response: budget });
  } catch (error) {
    console.error('Update budget error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOne({
      where: { id, userId: req.user.id }
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await budget.destroy();
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    console.error('Delete budget error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const autoGenerateBudget = async (req, res) => {
  try {
    const { targetMonth, targetYear, sourceMonth, sourceYear } = req.body;
    
    if (!targetMonth || !targetYear || !sourceMonth || !sourceYear) {
      return res.status(400).json({ message: 'Source and target periods are required' });
    }

    // 1. Fetch source budgets
    const sourceBudgets = await Budget.findAll({
      where: {
        userId: req.user.id,
        month: sourceMonth,
        year: sourceYear
      }
    });

    if (sourceBudgets.length === 0) {
      return res.status(404).json({ message: 'No budgets found to copy from the source period' });
    }

    // 2. Fetch existing target budgets to avoid duplicates
    const targetBudgets = await Budget.findAll({
      where: {
        userId: req.user.id,
        month: targetMonth,
        year: targetYear
      }
    });

    const existingCategoryIds = targetBudgets.map(b => b.categoryId);
    const budgetsToCreate = sourceBudgets
      .filter(b => !existingCategoryIds.includes(b.categoryId))
      .map(b => ({
        categoryId: b.categoryId,
        amount: b.amount,
        month: targetMonth,
        year: targetYear,
        userId: req.user.id
      }));

    if (budgetsToCreate.length === 0) {
      return res.json({ message: 'All budgets already exist for the target period', count: 0 });
    }

    const createdBudgets = await Budget.bulkCreate(budgetsToCreate);

    res.status(201).json({ 
      message: `Successfully generated ${createdBudgets.length} budgets for ${targetMonth}/${targetYear}`,
      count: createdBudgets.length
    });
  } catch (error) {
    console.error('Auto-generate budget error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  autoGenerateBudget
};
