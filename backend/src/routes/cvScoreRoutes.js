const express = require('express');
const router = express.Router();
const CvScoreController = require('../controllers/cvScoreController');
const uploadCv = require('../middlewares/uploadCv');

const optionalAuth = (req, res, next) => {
  const authMiddleware = require('../middlewares/authMiddleware');
  const token = req.cookies?.token;
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
    } catch (err) {}
  }
  next();
};

router.post('/analyze', optionalAuth, uploadCv.single('cv'), CvScoreController.analyzeCv);
router.get('/stats', CvScoreController.getStats);
router.get('/:id', CvScoreController.getAnalysis);
const { requireAuth } = require('../middlewares/authMiddleware');
router.get('/my/analyses', requireAuth, CvScoreController.getMyAnalyses);

module.exports = router;