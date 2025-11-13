/*
  Small runner script to apply a single SQL migration file using the existing DB config.
  Usage (PowerShell):
    node .\backend\scripts\run-migration.js ..\migrations\001-add-updated_at-to-registrations.sql
*/
const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function run() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Please pass path to SQL file as first argument');
    process.exit(1);
  }

  const sqlPath = path.resolve(process.cwd(), arg);
  if (!fs.existsSync(sqlPath)) {
    console.error('SQL file not found:', sqlPath);
    process.exit(1);
  }

  try {
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Applying migration:', sqlPath);
    const conn = await db.getConnection();
    try {
      const [result] = await conn.query(sql);
      console.log('Migration applied. Result:', result);
    } finally {
      conn.release();
    }
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
