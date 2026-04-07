// ================================================
// AUTH ROUTES - Routes d'authentification
// ================================================

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

// ================================================
// ROUTES PUBLIQUES (sans authentification)
// ================================================

// POST /api/auth/register - Inscription
router.post('/register', AuthController.register);

// POST /api/auth/login - Connexion
router.post('/login', AuthController.login);

// POST /api/auth/logout - Déconnexion
router.post('/logout', AuthController.logout);

// ================================================
// ROUTES PROTÉGÉES (avec authentification)
// ================================================

// GET /api/auth/me - Récupérer l'utilisateur connecté
router.get('/me', requireAuth, AuthController.me);

// POST /api/auth/refresh - Rafraîchir le token
router.post('/refresh', requireAuth, AuthController.refresh);

module.exports = router;