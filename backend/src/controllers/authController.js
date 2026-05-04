const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthController {
  
  static async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email et mot de passe requis'
        });
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Format d\'email invalide'
        });
      }
      
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Le mot de passe doit contenir au moins 6 caractères'
        });
      }
      
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: 'Cet email est déjà utilisé'
        });
      }
      
      const user = await User.create(email, password, firstName, lastName);
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
      });
      
      res.status(201).json({
        message: 'Inscription réussie',
        user: {
          id: user.id, email: user.email,
          firstName: user.first_name, 
          lastName: user.last_name,
          createdAt: user.created_at
        }
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email et mot de passe requis'
        });
      }
      
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Email ou mot de passe incorrect'
        });
      }
      
      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Email ou mot de passe incorrect'
        });
      }
      
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
      });
      
      res.json({
        message: 'Connexion réussie',
        user: {
          id: user.id, email: user.email,
          firstName: user.first_name, 
          lastName: user.last_name
        }
      });
      
    } catch (error) {
      next(error);
    }
  }
  
  static async logout(req, res, next) {
    try {
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
  
  static async me(req, res, next) {
    try {
      const user = await User.findById(req.userId);
      
      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé'
        });
      }
      
      res.json({
        user: {
          id: user.id, email: user.email,
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
  
  static async refresh(req, res, next) {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé'
        });
      }
      
      const newToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
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