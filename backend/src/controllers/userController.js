const path = require('path');
const pool = require('../config/database');

class UserController {

  // ================================================
  // UPLOAD AVATAR - Upload photo de profil
  // ================================================
  static async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier uploadé' });
      }

      // Chemin relatif stocké en BDD
      const photoUrl = `/uploads/profiles/${req.file.filename}`;

      // Mettre à jour dans la BDD
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
      console.error('❌ Erreur upload:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  // ================================================
  // GET PROFILE - Récupérer le profil utilisateur
  // ================================================
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
      console.error('❌ Erreur profil:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

module.exports = UserController;