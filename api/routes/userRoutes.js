const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.post('/', authMiddleware, adminMiddleware, userController.createUser);
router.get('/profile', authMiddleware, userController.getProfile);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUserById);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = router;
