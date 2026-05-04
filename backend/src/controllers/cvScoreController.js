const CvScore = require('../models/CvScore');
const TextExtractor = require('../utils/textExtractor');
const CvScorer = require('../utils/cvScorer');
const fs = require('fs').promises;

class CvScoreController {
  static async analyzeCv(req, res, next) {
    let filePath = null;

    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'Aucun fichier uploadé'
        });
      }

      filePath = req.file.path;
      const filename = req.file.originalname;
      const extracted = await TextExtractor.extract(filePath);
      const cleanText = TextExtractor.cleanText(extracted.text);
      const result = CvScorer.analyze(cleanText, extracted.numPages);
      const strengths = CvScorer.getStrengths(result.analysis);
      const weaknesses = CvScorer.getWeaknesses(result.analysis);
      
      const userId = req.userId || null;
      const cvScore = await CvScore.create(
        userId,
        filename,
        result.score,
        result.analysis,
        result.recommendations
      );

      await fs.unlink(filePath);

      res.json({
        message: 'Analyse terminée',
        score: result.score,
        strengths: strengths,
        weaknesses: weaknesses,
        recommendations: result.recommendations,
        analysisId: cvScore.id
      });

    } catch (error) {
      if (filePath) {
        try {
          await fs.unlink(filePath);
        } catch (e) {}
      }
      next(error);
    }
  }

  static async getAnalysis(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const cvScore = await CvScore.findById(id);

      if (!cvScore) {
        return res.status(404).json({
          error: 'Analyse non trouvée'
        });
      }

      const analysisDetails = typeof cvScore.analysis_details === 'string'
        ? JSON.parse(cvScore.analysis_details)
        : cvScore.analysis_details;

      const strengths = CvScorer.getStrengths(analysisDetails);
      const weaknesses = CvScorer.getWeaknesses(analysisDetails);

      res.json({
        id: cvScore.id,
        filename: cvScore.filename,
        score: cvScore.score,
        strengths: strengths,
        weaknesses: weaknesses,
        recommendations: cvScore.recommendations,
        createdAt: cvScore.created_at
      });

    } catch (error) {
      next(error);
    }
  }

  static async getStats(req, res, next) {
    try {
      const totalAnalyses = await CvScore.count();
      const averageScore = await CvScore.getAverageScore();

      res.json({
        totalAnalyses: totalAnalyses,
        averageScore: averageScore,
        message: `${totalAnalyses} CV analysés avec un score moyen de ${averageScore}/100`
      });

    } catch (error) {
      next(error);
    }
  }

  static async getMyAnalyses(req, res, next) {
    try {
      const userId = req.userId;
      const analyses = await CvScore.findByUserId(userId);

      res.json({
        count: analyses.length,
        analyses: analyses
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = CvScoreController;