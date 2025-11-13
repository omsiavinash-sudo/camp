const mysql = require('mysql2/promise');
require('dotenv').config();

async function verifyDatabase() {
    try {
        // Create connection
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Successfully connected to database');

        // Check tables
        const tables = ['users', 'roles', 'camps', 'registrations', 'consultation_reasons', 
                       'marital_status', 'guardian_types', 'registration_reasons'];
        
        for (const table of tables) {
            try {
                const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`Table ${table}: ${rows[0].count} records`);
            } catch (err) {
                console.error(`Error checking table ${table}:`, err.message);
            }
        }

        // Check admin user
        const [users] = await connection.execute('SELECT username, role_id FROM users WHERE username = ?', ['admin']);
        if (users.length > 0) {
            console.log('Admin user exists with role_id:', users[0].role_id);
        } else {
            console.log('Admin user does not exist');
        }

        await connection.end();
    } catch (err) {
        console.error('Database verification failed:', err);
    }
}

verifyDatabase();