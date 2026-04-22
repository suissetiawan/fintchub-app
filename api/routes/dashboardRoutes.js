const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/summary', transactionController.getDashboardSummary);
router.get('/breakdown', transactionController.getDashboardBreakdown);

module.exports = router;
