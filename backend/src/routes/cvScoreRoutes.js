const express = require('express');
const router = express.Router();
const CvScoreController = require('../controllers/cvScoreController');
const uploadCv = require('../middlewares/uploadCv');

// Middleware auth optionnel (pour savoir si user connecté)
const optionalAuth = (req, res, next) => {
  // Récupère le token si présent mais ne bloque pas
  const authMiddleware = require('../middlewares/authMiddleware');
  const token = req.cookies?.token;
  
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
    } catch (err) {
      // Token invalide, on continue sans userId
    }
  }
  
  next();
};

// POST /api/cv-score/analyze - Analyser un CV (PUBLIC ou connecté)
router.post('/analyze', optionalAuth, uploadCv.single('cv'), CvScoreController.analyzeCv);

// GET /api/cv-score/stats - Statistiques (PUBLIC)
router.get('/stats', CvScoreController.getStats);

// GET /api/cv-score/:id - Résultat analyse (PUBLIC)
router.get('/:id', CvScoreController.getAnalysis);

// GET /api/cv-score/my-analyses - Mes analyses (PRIVÉ)
const { requireAuth } = require('../middlewares/authMiddleware');
router.get('/my/analyses', requireAuth, CvScoreController.getMyAnalyses);

module.exports = router;