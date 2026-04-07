// ================================================
// MODEL USER - Gestion des utilisateurs
// ================================================

const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  
  // ================================================
  // CRÉER UN UTILISATEUR
  // ================================================
  static async create(email, password, firstName, lastName) {
    try {
      // Hasher le mot de passe (10 rounds)
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const query = `
        INSERT INTO users (email, password, first_name, last_name, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id, email, first_name, last_name, created_at
      `;
      
      const values = [email, hashedPassword, firstName, lastName];
      const result = await pool.query(query, values);
      
      return result.rows[0];
      
    } catch (error) {
      // Erreur duplicate email (contrainte unique)
      if (error.code === '23505') {
        throw new Error('Cet email est déjà utilisé');
      }
      throw error;
    }
  }
  
  // ================================================
  // TROUVER UN UTILISATEUR PAR EMAIL
  // ================================================
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      
      return result.rows[0] || null;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // TROUVER UN UTILISATEUR PAR ID
  // ================================================
  static async findById(id) {
    try {
      const query = `
        SELECT id, email, first_name, last_name, created_at, updated_at
        FROM users 
        WHERE id = $1
      `;
      const result = await pool.query(query, [id]);
      
      return result.rows[0] || null;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // VÉRIFIER LE MOT DE PASSE
  // ================================================
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // METTRE À JOUR UN UTILISATEUR
  // ================================================
  static async update(id, updates) {
    try {
      const { firstName, lastName, email } = updates;
      
      const query = `
        UPDATE users
        SET 
          first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          email = COALESCE($3, email),
          updated_at = NOW()
        WHERE id = $4
        RETURNING id, email, first_name, last_name, updated_at
      `;
      
      const values = [firstName, lastName, email, id];
      const result = await pool.query(query, values);
      
      return result.rows[0] || null;
      
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Cet email est déjà utilisé');
      }
      throw error;
    }
  }
  
  // ================================================
  // CHANGER LE MOT DE PASSE
  // ================================================
  static async updatePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const query = `
        UPDATE users
        SET password = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id
      `;
      
      const result = await pool.query(query, [hashedPassword, id]);
      
      return result.rows[0] || null;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // SUPPRIMER UN UTILISATEUR
  // ================================================
  static async delete(id) {
    try {
      const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [id]);
      
      return result.rows[0] || null;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ================================================
  // COMPTER LES UTILISATEURS (STATS)
  // ================================================
  static async count() {
    try {
      const query = 'SELECT COUNT(*) as total FROM users';
      const result = await pool.query(query);
      
      return parseInt(result.rows[0].total);
      
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;