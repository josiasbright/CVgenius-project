// ================================================
// MODEL ANALYTICS - Statistiques des CV
// ================================================

const pool = require('../config/database');

class Analytics {
  
  // ================================================
  // ENREGISTRER UN ÉVÉNEMENT
  // ================================================
  static async trackEvent(cvId, eventType) {
    try {
      const query = `
        INSERT INTO cv_analytics (cv_id, event_type, event_date)
        VALUES ($1, $2, NOW())
        RETURNING *
      `;
      
      const result = await pool.query(query, [cvId, eventType]);
      
      return result.rows[0];
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // RÉCUPÉRER LES STATS D'UN CV
  // ================================================
  static async getStatsByCvId(cvId) {
    try {
      const query = `
        SELECT 
          event_type,
          COUNT(*) as count
        FROM cv_analytics
        WHERE cv_id = $1
        GROUP BY event_type
      `;
      
      const result = await pool.query(query, [cvId]);
      
      // Formater les résultats
      const stats = {
        views: 0,
        downloads: 0
      };
      
      result.rows.forEach(row => {
        if (row.event_type === 'view') {
          stats.views = parseInt(row.count);
        } else if (row.event_type === 'download') {
          stats.downloads = parseInt(row.count);
        }
      });
      
      return stats;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // RÉCUPÉRER LES ÉVÉNEMENTS PAR JOUR (7 DERNIERS JOURS)
  // ================================================
  static async getEventsByDateRange(cvId, days = 7) {
    try {
      const query = `
        SELECT 
          DATE(event_date) as date,
          event_type,
          COUNT(*) as count
        FROM cv_analytics
        WHERE cv_id = $1 
          AND event_date >= NOW() - INTERVAL '${days} days'
        GROUP BY DATE(event_date), event_type
        ORDER BY date ASC, event_type
      `;
      
      const result = await pool.query(query, [cvId]);
      
      return result.rows;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // RÉCUPÉRER TOUS LES ÉVÉNEMENTS D'UN CV
  // ================================================
  static async getAllEventsByCvId(cvId, limit = 100) {
    try {
      const query = `
        SELECT * FROM cv_analytics
        WHERE cv_id = $1
        ORDER BY event_date DESC
        LIMIT $2
      `;
      
      const result = await pool.query(query, [cvId, limit]);
      
      return result.rows;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // SUPPRIMER LES ANALYTICS D'UN CV
  // ================================================
  static async deleteByCvId(cvId) {
    try {
      const query = 'DELETE FROM cv_analytics WHERE cv_id = $1';
      const result = await pool.query(query, [cvId]);
      
      return result.rowCount;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // STATS GLOBALES (ADMIN)
  // ================================================
  static async getGlobalStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_events,
          COUNT(DISTINCT cv_id) as total_cvs_tracked,
          SUM(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) as total_views,
          SUM(CASE WHEN event_type = 'download' THEN 1 ELSE 0 END) as total_downloads
        FROM cv_analytics
      `;
      
      const result = await pool.query(query);
      
      return {
        totalEvents: parseInt(result.rows[0].total_events),
        totalCvsTracked: parseInt(result.rows[0].total_cvs_tracked),
        totalViews: parseInt(result.rows[0].total_views),
        totalDownloads: parseInt(result.rows[0].total_downloads)
      };
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // TOP CV LES PLUS VUS
  // ================================================
  static async getTopViewedCvs(limit = 10) {
    try {
      const query = `
        SELECT 
          cv_id,
          COUNT(*) as view_count
        FROM cv_analytics
        WHERE event_type = 'view'
        GROUP BY cv_id
        ORDER BY view_count DESC
        LIMIT $1
      `;
      
      const result = await pool.query(query, [limit]);
      
      return result.rows;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // ACTIVITÉ RÉCENTE (DERNIÈRES 24H)
  // ================================================
  static async getRecentActivity(hours = 24, limit = 50) {
    try {
      const query = `
        SELECT * FROM cv_analytics
        WHERE event_date >= NOW() - INTERVAL '${hours} hours'
        ORDER BY event_date DESC
        LIMIT $1
      `;
      
      const result = await pool.query(query, [limit]);
      
      return result.rows;
      
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Analytics;