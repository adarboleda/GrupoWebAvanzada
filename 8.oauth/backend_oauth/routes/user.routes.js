const { Router } = require('express');
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

// Ruta protegida
router.get('/profile', authMiddleware, UserController.getProfile);

module.exports = router;
