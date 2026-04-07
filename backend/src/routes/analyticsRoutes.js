// ================================================
// ANALYTICS ROUTES - Routes des statistiques
// ================================================

const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const { requireAuth } = require('../middlewares/authMiddleware');

// GET /api/analytics/dashboard - Stats globales de l'user
router.get('/dashboard', requireAuth, AnalyticsController.getDashboard);

// GET /api/analytics/cv/:id - Stats d'un CV
router.get('/cv/:id', requireAuth, AnalyticsController.getCvStats);

// POST /api/analytics/track - Enregistrer un événement
router.post('/track', AnalyticsController.trackEvent);

// GET /api/analytics/activity - Activité récente
router.get('/activity', requireAuth, AnalyticsController.getRecentActivity);

module.exports = router;