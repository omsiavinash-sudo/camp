const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function updateDatabase() {
    const config = {
        host: process.env.DB_HOST || '10.11.12.68',
        user: process.env.DB_USER || 'my_camp',
        password: process.env.DB_PASSWORD || 'my_camp',
        database: process.env.DB_NAME || 'my_camp',
        multipleStatements: true
    };

    try {
        // Read the SQL file
        const sqlPath = path.join(__dirname, '..', '..', 'db', 'update_registration_names.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Create connection
        const connection = await mysql.createConnection(config);
        console.log('Connected to database');

        // Execute the SQL
        console.log('Running database updates...');
        await connection.query(sql);
        console.log('Database updated successfully');

        // Close connection
        await connection.end();
    } catch (error) {
        console.error('Error updating database:', error);
        process.exit(1);
    }
}

updateDatabase();