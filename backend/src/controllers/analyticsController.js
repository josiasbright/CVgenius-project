const Cv = require('../models/Cv');
const Analytics = require('../models/Analytics');

class AnalyticsController {
  
  static async getCvStats(req, res, next) {
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
      
      const stats = await Analytics.getStatsByCvId(cvId);
      
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
  
  static async getDashboard(req, res, next) {
    try {
      const userId = req.userId;
      
      const cvs = await Cv.findByUserId(userId);
      
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
  
  static async getRecentActivity(req, res, next) {
    try {
      const userId = req.userId;
      const hours = parseInt(req.query.hours) || 24;
      
      const cvs = await Cv.findByUserId(userId);
      const cvIds = cvs.map(cv => cv.id);
      
      if (cvIds.length === 0) {
        return res.json({
          activity: []
        });
      }
      
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