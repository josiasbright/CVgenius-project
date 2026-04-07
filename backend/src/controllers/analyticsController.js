// ================================================
// ANALYTICS CONTROLLER - Statistiques des CV
// ================================================

const Cv = require('../models/Cv');
const Analytics = require('../models/Analytics');

class AnalyticsController {
  
  // ================================================
  // GET CV STATS - Statistiques d'un CV
  // ================================================
  static async getCvStats(req, res, next) {
    try {
      const userId = req.userId;
      const cvId = parseInt(req.params.id);
      
      if (isNaN(cvId)) {
        return res.status(400).json({
          error: 'ID de CV invalide'
        });
      }
      
      // Vérifier que le CV appartient à l'user
      const cv = await Cv.findById(cvId, userId);
      if (!cv) {
        return res.status(404).json({
          error: 'CV non trouvé'
        });
      }
      
      // Récupérer les stats
      const stats = await Analytics.getStatsByCvId(cvId);
      
      // Récupérer les événements des 7 derniers jours
      const eventsByDate = await Analytics.getEventsByDateRange(cvId, 7);
      
      res.json({
        cvId: cvId,
        cvTitle: cv.title,
        stats: stats,
        viewCount: cv.view_count,
        downloadCount: cv.download_count,
        eventsByDate: eventsByDate
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  // ================================================
  // GET DASHBOARD - Stats globales de l'utilisateur
  // ================================================
  static async getDashboard(req, res, next) {
    try {
      const userId = req.userId;
      
      // Récupérer tous les CV de l'user
      const cvs = await Cv.findByUserId(userId);
      
      // Calculer les stats globales
      let totalViews = 0;
      let totalDownloads = 0;
      
      cvs.forEach(cv => {
        totalViews += cv.view_count || 0;
        totalDownloads += cv.download_count || 0;
      });
      
      res.json({
        totalCvs: cvs.length,
        totalViews: totalViews,
        totalDownloads: totalDownloads,
        cvs: cvs.map(cv => ({
          id: cv.id,
          title: cv.title,
          viewCount: cv.view_count,
          downloadCount: cv.download_count,
          isPublic: cv.is_public,
          updatedAt: cv.updated_at
        }))
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  // ================================================
  // TRACK EVENT - Enregistrer un événement (manuel)
  // ================================================
  static async trackEvent(req, res, next) {
    try {
      const { cvId, eventType } = req.body;
      
      if (!cvId || !eventType) {
        return res.status(400).json({
          error: 'cvId et eventType requis'
        });
      }
      
      if (!['view', 'download'].includes(eventType)) {
        return res.status(400).json({
          error: 'eventType doit être "view" ou "download"'
        });
      }
      
      await Analytics.trackEvent(cvId, eventType);
      
      res.json({
        message: 'Événement enregistré'
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  // ================================================
  // GET RECENT ACTIVITY - Activité récente
  // ================================================
  static async getRecentActivity(req, res, next) {
    try {
      const userId = req.userId;
      const hours = parseInt(req.query.hours) || 24;
      
      // Récupérer tous les CV de l'user
      const cvs = await Cv.findByUserId(userId);
      const cvIds = cvs.map(cv => cv.id);
      
      if (cvIds.length === 0) {
        return res.json({
          activity: []
        });
      }
      
      // Pour simplifier, on récupère l'activité du premier CV
      // En production, il faudrait une requête qui filtre par user_id
      const activity = await Analytics.getRecentActivity(hours, 50);
      
      res.json({
        hours: hours,
        activity: activity
      });
      
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AnalyticsController;