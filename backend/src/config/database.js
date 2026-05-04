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

pool.connect((err, client, release) => {
  if (err) {
    process.exit(1);
  } else {
    release();
  }
});

pool.on('error', (err) => {
});

module.exports = pool;