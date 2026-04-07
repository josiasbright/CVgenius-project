// ================================================
// SUMMARY CONTROLLER - Génération automatique de résumé
// ================================================

const summaryTemplates = require('../utils/summaryTemplates');

class SummaryController {
  
  // ================================================
  // GENERATE - Générer un résumé professionnel
  // ================================================
  static async generate(req, res, next) {
    try {
      const { jobTitle, yearsExperience, skills, tone, length } = req.body;
      
      // Validation
      if (!jobTitle || !yearsExperience) {
        return res.status(400).json({
          error: 'Titre du poste et années d\'expérience requis'
        });
      }
      
      // Générer le résumé
      const summary = summaryTemplates.generate({
        jobTitle,
        yearsExperience,
        skills: skills || [],
        tone: tone || 'professional',
        length: length || 'medium'
      });
      
      res.json({
        summary: summary
      });
      
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SummaryController;