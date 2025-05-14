const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, 
    max: 10, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000, 
});

// Test database connection
pool.connect()
    .then(client => {
        console.log('Connected to the PostgreSQL database.');
        client.release();   
    })
    .catch(err => 
        console.error('Database connection error:', err));

module.exports = pool;
