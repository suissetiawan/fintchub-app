const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);
router.get('/', settingController.getSettings);
router.post('/', settingController.upsertSetting);

module.exports = router;
