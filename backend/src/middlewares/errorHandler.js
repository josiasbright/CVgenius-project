// ================================================
// GESTIONNAIRE D'ERREURS GLOBAL
// ================================================

const errorHandler = (err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);

  // Erreur de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: err.message
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token invalide'
    });
  }

  // Erreur JWT expiré
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expiré'
    });
  }

  // Erreur PostgreSQL (violation contrainte unique)
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Cette valeur existe déjà',
      details: err.detail
    });
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    error: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;