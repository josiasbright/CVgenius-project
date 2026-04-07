// ================================================
// INTERVIEW QUESTION MODEL
// ================================================

const pool = require('../config/database');

class InterviewQuestion {

  // ================================================
  // GET RANDOM - Récupérer N questions aléatoires
  // ================================================
  static async getRandom(count = 5) {
    const result = await pool.query(
      `SELECT * FROM interview_questions 
       ORDER BY RANDOM() 
       LIMIT $1`,
      [count]
    );

    return result.rows;
  }

  // ================================================
  // GET ALL - Toutes les questions (admin)
  // ================================================
  static async getAll() {
    const result = await pool.query(
      `SELECT * FROM interview_questions 
       ORDER BY id ASC`
    );

    return result.rows;
  }

  // ================================================
  // COUNT - Nombre total de questions
  // ================================================
  static async count() {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM interview_questions`
    );

    return parseInt(result.rows[0].count);
  }

  // ================================================
  // GET BY ID - Une question spécifique
  // ================================================
  static async getById(id) {
    const result = await pool.query(
      `SELECT * FROM interview_questions WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }
}

module.exports = InterviewQuestion;