const pool = require('../config/database');

class Cv {
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
      
      const cv = result.rows[0];
      cv.cv_data = typeof cv.cv_data === 'string' ? JSON.parse(cv.cv_data) : cv.cv_data;
      
      return cv;
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const query = `
        SELECT * FROM cvs 
        WHERE user_id = $1 
        ORDER BY updated_at DESC
      `;
      
      const result = await pool.query(query, [userId]);
      
      return result.rows.map(cv => ({
        ...cv,
        cv_data: typeof cv.cv_data === 'string' ? JSON.parse(cv.cv_data) : cv.cv_data
      }));
    } catch (error) {
      throw error;
    }
  }

  static async findById(cvId, userId = null) {
    try {
      let query = 'SELECT * FROM cvs WHERE id = $1';
      const values = [cvId];
      
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

  static async generatePublicSlug(cvId, userId) {
    try {
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
      if (error.code === '23505') {
        return this.generatePublicSlug(cvId, userId);
      }
      throw error;
    }
  }

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

  static async countByUserId(userId) {
    try {
      const query = 'SELECT COUNT(*) as total FROM cvs WHERE user_id = $1';
      const result = await pool.query(query, [userId]);

      return parseInt(result.rows[0].total);

    } catch (error) {
      throw error;
    }
  }

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