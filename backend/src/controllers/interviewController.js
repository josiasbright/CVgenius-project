// ================================================
// INTERVIEW CONTROLLER - Simulation entretien
// ================================================

const InterviewQuestion = require('../models/InterviewQuestion');

class InterviewController {

  // ================================================
  // START SIMULATION - Récupérer 5 questions aléatoires
  // ================================================
  static async startSimulation(req, res, next) {
    try {
      const questions = await InterviewQuestion.getRandom(5);

      res.json({
        message: 'Simulation d\'entretien générée',
        totalQuestions: 5,
        questions: questions
      });

    } catch (error) {
      next(error);
    }
  }

  // ================================================
  // GET ALL QUESTIONS - Toutes les questions (admin)
  // ================================================
  static async getAllQuestions(req, res, next) {
    try {
      const questions = await InterviewQuestion.getAll();
      const count = await InterviewQuestion.count();

      res.json({
        count: count,
        questions: questions
      });

    } catch (error) {
      next(error);
    }
  }

  // ================================================
  // GET STATS - Statistiques banque de questions
  // ================================================
  static async getStats(req, res, next) {
    try {
      const count = await InterviewQuestion.count();

      res.json({
        totalQuestions: count,
        questionsPerSimulation: 5,
        possibleCombinations: count >= 5 ? 'Plus de 2 millions' : 'N/A'
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = InterviewController;