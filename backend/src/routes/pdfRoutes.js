// ================================================
// PDF ROUTES - Routes de génération PDF
// ================================================

const express = require('express');
const router = express.Router();
const PdfController = require('../controllers/pdfController');
const { requireAuth } = require('../middlewares/authMiddleware');

// POST /api/pdf/generate/:id - Générer et télécharger PDF
router.post('/generate/:id', requireAuth, PdfController.generate);

// GET /api/pdf/preview/:id - Prévisualiser PDF
router.get('/preview/:id', requireAuth, PdfController.preview);

// GET /api/pdf/test - Route de test (sans auth pour debug)
router.get('/test', PdfController.test);

module.exports = router;