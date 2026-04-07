// ================================================
// AUTH MIDDLEWARE - Vérification de l'authentification
// ================================================

const jwt = require('jsonwebtoken');

// ================================================
// MIDDLEWARE : Vérifier si l'utilisateur est authentifié
// ================================================
const requireAuth = (req, res, next) => {
  try {
    // Récupérer le token depuis le cookie
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        error: 'Non authentifié - Token manquant'
      });
    }
    
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ajouter les infos user à la requête
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    // Continuer vers la route suivante
    next();
    
  } catch (error) {
    // Token invalide ou expiré
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expiré - Veuillez vous reconnecter'
      });
    }
    
    return res.status(500).json({
      error: 'Erreur d\'authentification'
    });
  }
};

// ================================================
// MIDDLEWARE : Vérifier si l'utilisateur est authentifié (optionnel)
// ================================================
const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      req.userEmail = decoded.email;
    }
    
    // Continuer même si pas de token
    next();
    
  } catch (error) {
    // Ignorer les erreurs et continuer
    next();
  }
};

module.exports = {
  requireAuth,
  optionalAuth
};