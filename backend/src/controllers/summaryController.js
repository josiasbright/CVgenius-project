const summaryTemplates = require('../utils/summaryTemplates');

class SummaryController {
  
  static async generate(req, res, next) {
    try {
      const { jobTitle, yearsExperience, skills, tone, length } = req.body;
      
      if (!jobTitle || !yearsExperience) {
        return res.status(400).json({
          error: 'Titre du poste et années d\'expérience requis'
        });
      }
      
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