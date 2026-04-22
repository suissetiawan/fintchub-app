const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { authMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', budgetController.getAllBudgets);
router.post('/', budgetController.createBudget);
router.post('/autogenerate', budgetController.autoGenerateBudget);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);

module.exports = router;
