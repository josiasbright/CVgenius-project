const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/dashboard', requireAuth, AnalyticsController.getDashboard);
router.get('/cv/:id', requireAuth, AnalyticsController.getCvStats);
router.post('/track', AnalyticsController.trackEvent);
router.get('/activity', requireAuth, AnalyticsController.getRecentActivity);

module.exports = router;