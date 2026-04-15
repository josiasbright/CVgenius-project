// ================================================
// AUTH CONTROLLER - Gestion de l'authentification
// ================================================

const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthController {
  
  // ================================================
  // REGISTER - Inscription d'un nouvel utilisateur
  // ================================================
  static async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Validation des données
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email et mot de passe requis'
        });
      }
      
      // Validation format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Format d\'email invalide'
        });
      }
      
      // Validation longueur mot de passe
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Le mot de passe doit contenir au moins 6 caractères'
        });
      }
      
      // Vérifier si l'email existe déjà
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: 'Cet email est déjà utilisé'
        });
      }
      
      // Créer l'utilisateur
      const user = await User.create(email, password, firstName, lastName);
      
      // Générer le JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Stocker le token dans un cookie httpOnly (MODIFIÉ POUR RENDER)
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
      });
      
      // Retourner les infos user (sans le mot de passe)
      res.status(201).json({
        message: 'Inscription réussie',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          createdAt: user.created_at
        }
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  // ================================================
  // LOGIN - Connexion d'un utilisateur
  // ================================================
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      // Validation
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email et mot de passe requis'
        });
      }
      
      // Trouver l'utilisateur
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Email ou mot de passe incorrect'
        });
      }
      
      // Vérifier le mot de passe
      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Email ou mot de passe incorrect'
        });
      }
      
      // Générer le JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Stocker le token dans un cookie httpOnly (MODIFIÉ POUR RENDER)
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
      });
      
      // Retourner les infos user
      res.json({
        message: 'Connexion réussie',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        }
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  // ================================================
  // LOGOUT - Déconnexion
  // ================================================
  static async logout(req, res, next) {
    try {
      // Supprimer le cookie (MODIFIÉ POUR RENDER)
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });
      
      res.json({
        message: 'Déconnexion réussie'
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  // ================================================
  // ME - Récupérer l'utilisateur connecté
  // ================================================
  static async me(req, res, next) {
    try {
      // req.userId est ajouté par le middleware authMiddleware
      const user = await User.findById(req.userId);
      
      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé'
        });
      }
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  // ================================================
  // REFRESH - Rafraîchir le token (optionnel)
  // ================================================
  static async refresh(req, res, next) {
    try {
      // Le middleware a déjà vérifié le token
      const userId = req.userId;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé'
        });
      }
      
      // Générer un nouveau token
      const newToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Mettre à jour le cookie (MODIFIÉ POUR RENDER)
      res.cookie('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });
      
      res.json({
        message: 'Token rafraîchi'
      });
      
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;