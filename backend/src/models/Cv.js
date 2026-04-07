// ================================================
// MODEL CV - Gestion des CV
// ================================================

const pool = require('../config/database');

class Cv {
  
  // ================================================
  // CRÉER UN CV
  // ================================================
  static async create(userId, title, cvData, templateName = 'modern', themeColor = '#8B5CF6') {
    try {
      const query = `
        INSERT INTO cvs (
          user_id, 
          title, 
          cv_data, 
          template_name, 
          theme_color,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *
      `;
      
      const values = [userId, title, JSON.stringify(cvData), templateName, themeColor];
      const result = await pool.query(query, values);
      
      // Parser le JSON de retour
      const cv = result.rows[0];
      cv.cv_data = typeof cv.cv_data === 'string' ? JSON.parse(cv.cv_data) : cv.cv_data;
      
      return cv;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // RÉCUPÉRER TOUS LES CV D'UN UTILISATEUR
  // ================================================
  static async findByUserId(userId) {
    try {
      const query = `
        SELECT * FROM cvs 
        WHERE user_id = $1 
        ORDER BY updated_at DESC
      `;
      
      const result = await pool.query(query, [userId]);
      
      // Parser les JSON
      return result.rows.map(cv => ({
        ...cv,
        cv_data: typeof cv.cv_data === 'string' ? JSON.parse(cv.cv_data) : cv.cv_data
      }));
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // RÉCUPÉRER UN CV PAR ID
  // ================================================
  static async findById(cvId, userId = null) {
    try {
      let query = 'SELECT * FROM cvs WHERE id = $1';
      const values = [cvId];
      
      // Si userId fourni, vérifier que le CV appartient à l'user
      if (userId) {
        query += ' AND user_id = $2';
        values.push(userId);
      }
      
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const cv = result.rows[0];
      cv.cv_data = typeof cv.cv_data === 'string' ? JSON.parse(cv.cv_data) : cv.cv_data;
      
      return cv;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // RÉCUPÉRER UN CV PUBLIC PAR SLUG
  // ================================================
  static async findBySlug(slug) {
    try {
      const query = `
        SELECT * FROM cvs 
        WHERE public_slug = $1 AND is_public = true
      `;
      
      const result = await pool.query(query, [slug]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const cv = result.rows[0];
      cv.cv_data = typeof cv.cv_data === 'string' ? JSON.parse(cv.cv_data) : cv.cv_data;
      
      return cv;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // METTRE À JOUR UN CV
  // ================================================
  static async update(cvId, userId, updates) {
    try {
      const { title, cvData, templateName, themeColor } = updates;
      
      const query = `
        UPDATE cvs
        SET 
          title = COALESCE($1, title),
          cv_data = COALESCE($2, cv_data),
          template_name = COALESCE($3, template_name),
          theme_color = COALESCE($4, theme_color),
          updated_at = NOW()
        WHERE id = $5 AND user_id = $6
        RETURNING *
      `;
      
      const values = [
        title,
        cvData ? JSON.stringify(cvData) : null,
        templateName,
        themeColor,
        cvId,
        userId
      ];
      
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const cv = result.rows[0];
      cv.cv_data = typeof cv.cv_data === 'string' ? JSON.parse(cv.cv_data) : cv.cv_data;
      
      return cv;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // SUPPRIMER UN CV
  // ================================================
  static async delete(cvId, userId) {
    try {
      const query = `
        DELETE FROM cvs 
        WHERE id = $1 AND user_id = $2
        RETURNING id
      `;
      
      const result = await pool.query(query, [cvId, userId]);
      
      return result.rows[0] || null;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // GÉNÉRER UN SLUG UNIQUE POUR PARTAGE PUBLIC
  // ================================================
  static async generatePublicSlug(cvId, userId) {
    try {
      // Générer un slug aléatoire
      const slug = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
      
      const query = `
        UPDATE cvs
        SET public_slug = $1, is_public = true, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING public_slug
      `;
      
      const result = await pool.query(query, [slug, cvId, userId]);
      
      return result.rows[0] || null;
      
    } catch (error) {
      // Si collision de slug (très rare), réessayer
      if (error.code === '23505') {
        return this.generatePublicSlug(cvId, userId);
      }
      throw error;
    }
  }
  
  // ================================================
  // RENDRE UN CV PRIVÉ
  // ================================================
  static async makePrivate(cvId, userId) {
    try {
      const query = `
        UPDATE cvs
        SET is_public = false, updated_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING id
      `;
      
      const result = await pool.query(query, [cvId, userId]);
      
      return result.rows[0] || null;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // INCRÉMENTER LE COMPTEUR DE VUES
  // ================================================
  static async incrementViewCount(cvId) {
    try {
      const query = `
        UPDATE cvs
        SET view_count = view_count + 1
        WHERE id = $1
        RETURNING view_count
      `;
      
      const result = await pool.query(query, [cvId]);
      
      return result.rows[0] || null;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // INCRÉMENTER LE COMPTEUR DE TÉLÉCHARGEMENTS
  // ================================================
  static async incrementDownloadCount(cvId) {
    try {
      const query = `
        UPDATE cvs
        SET download_count = download_count + 1
        WHERE id = $1
        RETURNING download_count
      `;
      
      const result = await pool.query(query, [cvId]);
      
      return result.rows[0] || null;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // COMPTER LES CV D'UN UTILISATEUR
  // ================================================
  static async countByUserId(userId) {
    try {
      const query = 'SELECT COUNT(*) as total FROM cvs WHERE user_id = $1';
      const result = await pool.query(query, [userId]);
      
      return parseInt(result.rows[0].total);
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // COMPTER TOUS LES CV (STATS GLOBALES)
  // ================================================
  static async count() {
    try {
      const query = 'SELECT COUNT(*) as total FROM cvs';
      const result = await pool.query(query);
      
      return parseInt(result.rows[0].total);
      
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Cv;