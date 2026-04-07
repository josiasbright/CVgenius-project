// ================================================
// CV ROUTES - Routes des CV
// ================================================

const express = require('express');
const router = express.Router();
const CvController = require('../controllers/cvController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Toutes les routes nécessitent l'authentification sauf les routes publiques

// GET /api/cvs - Liste des CV de l'utilisateur
router.get('/', requireAuth, CvController.getAll);

// GET /api/cvs/:id - Récupérer un CV
router.get('/:id', requireAuth, CvController.getOne);

// POST /api/cvs - Créer un CV
router.post('/', requireAuth, CvController.create);

// PUT /api/cvs/:id - Mettre à jour un CV
router.put('/:id', requireAuth, CvController.update);

// DELETE /api/cvs/:id - Supprimer un CV
router.delete('/:id', requireAuth, CvController.delete);

// POST /api/cvs/:id/share - Générer lien public
router.post('/:id/share', requireAuth, CvController.share);

// POST /api/cvs/:id/private - Rendre privé
router.post('/:id/private', requireAuth, CvController.makePrivate);

module.exports = router;