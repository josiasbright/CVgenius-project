const Cv = require('../models/Cv');
const Analytics = require('../models/Analytics');

class CvController {
  
  static async getAll(req, res, next) {
    try {
      const userId = req.userId;
      
      const cvs = await Cv.findByUserId(userId);
      
      res.json({
        count: cvs.length,
        cvs: cvs
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  static async getOne(req, res, next) {
    try {
      const userId = req.userId;
      const cvId = parseInt(req.params.id);
      
      if (isNaN(cvId)) {
        return res.status(400).json({
          error: 'ID de CV invalide'
        });
      }
      
      const cv = await Cv.findById(cvId, userId);
      
      if (!cv) {
        return res.status(404).json({ error: 'CV non trouvé' });
      }
      
      res.json({
        cv: cv
      });
      
    } catch (error) {
      next(error);
    }
  }
  
 static async create(req, res, next) {
    try {
      const userId = req.userId;
      const { title, cvData, templateName, themeColor } = req.body;
      
      if (!title || !cvData) {
        return res.status(400).json({ error: 'Titre et données du CV requis' });
      }
      
      const cv = await Cv.create(
        userId,
        title,
        cvData,
        templateName || 'thomas-style',
        themeColor || '#8B5CF6'
      );
      
      res.status(201).json({ cv });
    } catch (error) {
      next(error);
    }
  }
  static async update(req, res, next) {
    try {
      const userId = req.userId;
      const cvId = parseInt(req.params.id);
      const updates = req.body;
      
      if (isNaN(cvId)) {
        return res.status(400).json({
          error: 'ID de CV invalide'
        });
      }
      
      const existingCv = await Cv.findById(cvId, userId);
      if (!existingCv) {
        return res.status(404).json({ error: 'CV non trouvé' });
      }
      
      const cv = await Cv.update(cvId, userId, updates);
      
      res.json({
        message: 'CV mis à jour avec succès',
        cv: cv
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  static async delete(req, res, next) {
    try {
      const userId = req.userId;
      const cvId = parseInt(req.params.id);
      
      if (isNaN(cvId)) {
        return res.status(400).json({
          error: 'ID de CV invalide'
        });
      }
      
      const deleted = await Cv.delete(cvId, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: 'CV non trouvé' });
      }
      
      res.json({
        message: 'CV supprimé avec succès'
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  static async share(req, res, next) {
    try {
      const userId = req.userId;
      const cvId = parseInt(req.params.id);
      
      if (isNaN(cvId)) {
        return res.status(400).json({
          error: 'ID de CV invalide'
        });
      }
      
      const cv = await Cv.findById(cvId, userId);
      if (!cv) {
        return res.status(404).json({ error: 'CV non trouvé' });
      }
      
      const result = await Cv.generatePublicSlug(cvId, userId);
      
      if (!result) {
        return res.status(500).json({
          error: 'Erreur lors de la génération du lien'
        });
      }
      
      const publicUrl = `${req.protocol}://${req.get('host')}/api/public/cv/${result.public_slug}`;
      
      res.json({
        message: 'Lien public généré',
        publicSlug: result.public_slug,
        publicUrl: publicUrl
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  static async makePrivate(req, res, next) {
    try {
      const userId = req.userId;
      const cvId = parseInt(req.params.id);
      
      if (isNaN(cvId)) {
        return res.status(400).json({
          error: 'ID de CV invalide'
        });
      }
      
      const result = await Cv.makePrivate(cvId, userId);
      
      if (!result) {
        return res.status(404).json({ error: 'CV non trouvé' });
      }
      
      res.json({
        message: 'CV rendu privé'
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  static async getPublic(req, res, next) {
    try {
      const slug = req.params.slug;
      
      const cv = await Cv.findBySlug(slug);
      
      if (!cv) {
        return res.status(404).json({
          error: 'CV non trouvé ou non public'
        });
      }
      
      await Analytics.trackEvent(cv.id, 'view');
      await Cv.incrementViewCount(cv.id);
      
      res.json({
        cv: cv
      });
      
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CvController;
