// ================================================
// COVER LETTER MODEL - Gestion lettres de motivation
// ================================================

const pool = require('../config/database');

class CoverLetter {

  // ================================================
  // CREATE - Créer une lettre depuis un CV
  // ================================================
  static async create(cvId, userId, data) {
    const {
      title,
      targetCompany,
      targetPosition,
      companyType,
      jobOfferText,
      content,
      templateName
    } = data;

    const result = await pool.query(
      `INSERT INTO cover_letters 
       (cv_id, user_id, title, target_company, target_position, 
        company_type, job_offer_text, content, template_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        cvId,
        userId,
        title,
        targetCompany,
        targetPosition,
        companyType,
        jobOfferText || null,
        JSON.stringify(content),
        templateName || 'classique'
      ]
    );

    return result.rows[0];
  }

  // ================================================
  // FIND BY CV ID - Toutes les lettres d'un CV
  // ================================================
  static async findByCvId(cvId, userId) {
    const result = await pool.query(
      `SELECT * FROM cover_letters 
       WHERE cv_id = $1 AND user_id = $2 
       ORDER BY created_at DESC`,
      [cvId, userId]
    );

    return result.rows;
  }

  // ================================================
  // FIND BY ID - Une lettre spécifique
  // ================================================
  static async findById(id, userId) {
    const result = await pool.query(
      `SELECT cl.*, c.title as cv_title, c.cv_data
       FROM cover_letters cl
       JOIN cvs c ON c.id = cl.cv_id
       WHERE cl.id = $1 AND cl.user_id = $2`,
      [id, userId]
    );

    return result.rows[0];
  }

  // ================================================
  // FIND ALL BY USER - Toutes les lettres d'un user
  // ================================================
  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT cl.*, c.title as cv_title
       FROM cover_letters cl
       JOIN cvs c ON c.id = cl.cv_id
       WHERE cl.user_id = $1
       ORDER BY cl.created_at DESC`,
      [userId]
    );

    return result.rows;
  }

  // ================================================
  // UPDATE - Modifier une lettre
  // ================================================
  static async update(id, userId, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'title',
      'target_company',
      'target_position',
      'company_type',
      'job_offer_text',
      'content',
      'template_name'
    ];

    Object.keys(updates).forEach(key => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      
      if (allowedFields.includes(snakeKey)) {
        fields.push(`${snakeKey} = $${paramIndex}`);
        values.push(key === 'content' ? JSON.stringify(updates[key]) : updates[key]);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error('Aucun champ valide à mettre à jour');
    }

    values.push(id, userId);

    const result = await pool.query(
      `UPDATE cover_letters 
       SET ${fields.join(', ')}
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  // ================================================
  // DELETE - Supprimer une lettre
  // ================================================
  static async delete(id, userId) {
    const result = await pool.query(
      `DELETE FROM cover_letters 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [id, userId]
    );

    return result.rows[0];
  }

  // ================================================
  // COUNT BY CV - Nombre de lettres pour un CV
  // ================================================
  static async countByCvId(cvId, userId) {
    const result = await pool.query(
      `SELECT COUNT(*) as count 
       FROM cover_letters 
       WHERE cv_id = $1 AND user_id = $2`,
      [cvId, userId]
    );

    return parseInt(result.rows[0].count);
  }
}

module.exports = CoverLetter;