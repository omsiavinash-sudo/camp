const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function run() {
  const sqlPath = path.resolve(__dirname, '..', '..', 'db', 'doctor_exams.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  };

  const connection = await mysql.createConnection(config);
  try {
    console.log('Running SQL migration...');
    await connection.query(sql);
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

run().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
