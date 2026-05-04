const express = require('express');
const router = express.Router();
const PdfController = require('../controllers/pdfController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.post('/generate/:id', requireAuth, PdfController.generate);
router.get('/preview/:id', requireAuth, PdfController.preview);
router.get('/test', PdfController.test);

module.exports = router;