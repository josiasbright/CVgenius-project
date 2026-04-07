// ================================================
// CV SCORE MODEL
// ================================================

const pool = require('../config/database');

class CvScore {

  // ================================================
  // CREATE - Enregistrer un résultat d'analyse
  // ================================================
  static async create(userId, filename, score, analysisDetails, recommendations) {
    const result = await pool.query(
      `INSERT INTO cv_scores 
       (user_id, filename, score, analysis_details, recommendations)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        userId || null,
        filename,
        score,
        JSON.stringify(analysisDetails),
        recommendations
      ]
    );

    return result.rows[0];
  }

  // ================================================
  // FIND BY ID
  // ================================================
  static async findById(id) {
    const result = await pool.query(
      `SELECT * FROM cv_scores WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }

  // ================================================
  // FIND BY USER
  // ================================================
  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM cv_scores 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows;
  }

  // ================================================
  // GET RECENT - Analyses récentes (publiques)
  // ================================================
  static async getRecent(limit = 10) {
    const result = await pool.query(
      `SELECT id, filename, score, created_at 
       FROM cv_scores 
       ORDER BY created_at DESC 
       LIMIT $1`,
      [limit]
    );

    return result.rows;
  }

  // ================================================
  // GET AVERAGE SCORE - Score moyen
  // ================================================
  static async getAverageScore() {
    const result = await pool.query(
      `SELECT AVG(score)::INTEGER as avg_score 
       FROM cv_scores`
    );

    return result.rows[0]?.avg_score || 0;
  }

  // ================================================
  // COUNT TOTAL
  // ================================================
  static async count() {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM cv_scores`
    );

    return parseInt(result.rows[0].count);
  }
}

module.exports = CvScore;