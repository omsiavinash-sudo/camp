const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST || '10.11.12.68',
  user: process.env.DB_USER || 'my_camp',
  password: process.env.DB_PASSWORD || 'my_camp',
  database: process.env.DB_NAME || 'my_camp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Database connected successfully');
    console.log('Connection config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
    connection.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit if we can't connect to the database
  }
}

testConnection();

module.exports = db;
