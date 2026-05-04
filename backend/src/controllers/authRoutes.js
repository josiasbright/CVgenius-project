const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

router.get('/me', requireAuth, AuthController.me);
router.post('/refresh', requireAuth, AuthController.refresh);

module.exports = router;