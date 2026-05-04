const path = require('path');
const pool = require('../config/database');

class UserController {
  static async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier uploadé' });
      }
      const photoUrl = `/uploads/profiles/${req.file.filename}`;
      await pool.query(
        'UPDATE users SET photo_url = $1 WHERE id = $2',
        [photoUrl, req.userId]
      );

      res.json({
        success: true,
        photoUrl: photoUrl,
        message: 'Photo uploadée avec succès'
      });

    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
  static async getProfile(req, res) {
    try {
      const result = await pool.query(
        'SELECT id, email, name, photo_url, created_at FROM users WHERE id = $1',
        [req.userId]
      );

      if (!result.rows[0]) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({ user: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

module.exports = UserController;