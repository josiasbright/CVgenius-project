const express = require('express');
const router = express.Router();
const CoverLetterController = require('../controllers/coverLetterController');

// Extraction propre de requireAuth (qui est une fonction)
const { requireAuth } = require('../middlewares/authMiddleware');

// --- ROUTES ---

// POST /api/cover-letters/cv/:cvId
// Changement de l'URL pour être plus logique et correspondre au Controller
router.post('/cv/:cvId', requireAuth, CoverLetterController.createFromCv);

// GET /api/cover-letters/cv/:cvId
router.get('/cv/:cvId', requireAuth, CoverLetterController.getAllByCv);

// GET /api/cover-letters
router.get('/', requireAuth, CoverLetterController.getAllByUser);

// GET /api/cover-letters/:id
router.get('/:id', requireAuth, CoverLetterController.getOne);

// PUT /api/cover-letters/:id
router.put('/:id', requireAuth, CoverLetterController.update);

// DELETE /api/cover-letters/:id
router.delete('/:id', requireAuth, CoverLetterController.delete);

// POST /api/cover-letters/:id/generate-pdf
router.post('/:id/generate-pdf', requireAuth, CoverLetterController.generatePdf);

module.exports = router;