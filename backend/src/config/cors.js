// ================================================
// CONFIGURATION CORS
// ================================================

const allowedOrigins = [
  'http://localhost:5173',                        // dev local Vite
  'http://localhost:3000',                        // dev local fallback
  process.env.FRONTEND_URL,                       // variable Render
].filter(Boolean); // supprime les valeurs undefined

const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (Postman, mobile, server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS bloqué pour : ${origin}`);
      callback(new Error(`CORS non autorisé pour : ${origin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;