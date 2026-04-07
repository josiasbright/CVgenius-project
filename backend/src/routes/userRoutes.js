const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// 1. On extrait 'requireAuth' du fichier middleware (Destructuration)
// C'est ici que ça bloquait : on ne peut pas passer l'objet complet à router.get
const { requireAuth } = require('../middlewares/authMiddleware');

// 2. On importe le middleware d'upload (Multer)
const upload = require('../middlewares/upload');

// ================================================
// ROUTES UTILISATEUR
// ================================================

/**
 * @route   GET /api/user/profile
 * @desc    Récupérer les informations du profil
 * @access  Privé (nécessite d'être connecté)
 */
router.get('/profile', requireAuth, UserController.getProfile);

/**
 * @route   POST /api/user/avatar
 * @desc    Uploader une photo de profil
 * @access  Privé (nécessite d'être connecté)
 */
router.post('/avatar', requireAuth, upload.single('photo'), UserController.uploadAvatar);

module.exports = router;