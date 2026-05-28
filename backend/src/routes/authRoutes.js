const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Trop de tentatives, réessaye dans 15 minutes.' }
});

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);
router.post('/logout', authLimiter, AuthController.logout);
router.get('/me', authLimiter, requireAuth, AuthController.me);
router.post('/refresh', authLimiter, requireAuth, AuthController.refresh);
module.exports = router;