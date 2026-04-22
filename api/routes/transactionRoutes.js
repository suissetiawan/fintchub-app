const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', transactionController.getAllTransactions);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

// Dashboard specific endpoints (compatible with dashboardStore v2)
router.get('/summary', transactionController.getDashboardSummary);
router.get('/breakdown', transactionController.getDashboardBreakdown);

module.exports = router;
