// ================================================
// CONFIGURATION BASE DE DONNÉES POSTGRESQL
// ================================================

const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'cvgenius',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS,
      },
  {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  }
);

// Tester la connexion au démarrage
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erreur connexion PostgreSQL:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connecté à PostgreSQL');
    release();
  }
});

pool.on('error', (err) => {
  console.error('❌ Erreur inattendue PostgreSQL:', err);
});

module.exports = pool;