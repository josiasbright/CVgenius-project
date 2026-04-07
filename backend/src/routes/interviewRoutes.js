const express = require('express');
const router = express.Router();
const InterviewController = require('../controllers/interviewController');
const { requireAuth } = require('../middlewares/authMiddleware');

// GET /api/interview/start - Lancer simulation (5 questions aléatoires)
router.get('/start', requireAuth, InterviewController.startSimulation);

// GET /api/interview/questions - Toutes les questions (admin)
router.get('/questions', requireAuth, InterviewController.getAllQuestions);

// GET /api/interview/stats - Statistiques
router.get('/stats', InterviewController.getStats);

module.exports = router;