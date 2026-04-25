const { Budget, Category, BudgetTemplate } = require('../models');

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
      return res.status(400).json({ message: 'Budget untuk kategori pada periode ini sudah ada.' });
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

const { Op } = require('sequelize');

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

    // Validate uniqueness
    const existingBudget = await Budget.findOne({
      where: {
        userId: req.user.id,
        categoryId,
        month,
        year,
        id: { [Op.ne]: id }
      }
    });

    if (existingBudget) {
      return res.status(400).json({ message: 'Budget untuk kategori pada periode ini sudah ada.' });
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
    let sourceData = await Budget.findAll({
      where: {
        userId: req.user.id,
        month: sourceMonth,
        year: sourceYear
      }
    });

    let usedTemplate = false;
    // Fallback to Template if source month is empty
    if (sourceData.length === 0) {
      sourceData = await BudgetTemplate.findAll({
        where: { userId: req.user.id }
      });
      usedTemplate = sourceData.length > 0;
    }

    if (sourceData.length === 0) {
      return res.status(404).json({ message: 'No budgets found in previous month and no templates defined.' });
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
    const budgetsToCreate = sourceData
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
      message: `Successfully generated ${createdBudgets.length} budgets ${usedTemplate ? 'from template' : ''}`,
      count: createdBudgets.length,
      fromTemplate: usedTemplate
    });
  } catch (error) {
    console.error('Auto-generate budget error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBudgetTemplates = async (req, res) => {
  try {
    const templates = await BudgetTemplate.findAll({
      where: { userId: req.user.id },
      include: [{ model: Category, as: 'category', attributes: ['name'] }]
    });
    res.json({ response: templates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBudgetTemplates = async (req, res) => {
  try {
    const { templates } = req.body; // Array of { categoryId, amount }
    
    // Simple approach: Delete existing templates for user and create new ones
    await BudgetTemplate.destroy({ where: { userId: req.user.id } });
    
    if (templates && templates.length > 0) {
      const toCreate = templates.map(t => ({
        userId: req.user.id,
        categoryId: t.categoryId,
        amount: t.amount
      }));
      await BudgetTemplate.bulkCreate(toCreate);
    }
    
    res.json({ message: 'Templates updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  autoGenerateBudget,
  getBudgetTemplates,
  updateBudgetTemplates
};
