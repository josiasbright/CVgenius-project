const pool = require('../config/database');

class InterviewQuestion {

  static async getRandom(count = 5) {
    const result = await pool.query(
      `SELECT * FROM interview_questions 
       ORDER BY RANDOM() 
       LIMIT $1`,
      [count]
    );

    return result.rows;
  }

  static async getAll() {
    const result = await pool.query(
      `SELECT * FROM interview_questions 
       ORDER BY id ASC`
    );

    return result.rows;
  }

  static async count() {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM interview_questions`
    );

    return parseInt(result.rows[0].count);
  }

  static async getById(id) {
    const result = await pool.query(
      `SELECT * FROM interview_questions WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }
}

module.exports = InterviewQuestion;