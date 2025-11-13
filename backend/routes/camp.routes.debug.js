const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const db = require('../config/database');

console.log('Camp routes loading...');

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Camp routes are working' });
});

// Get all camps
router.get('/', verifyToken, async (req, res) => {
    console.log('GET /api/camps called');
    try {
        const [camps] = await db.query(
            'SELECT * FROM camps ORDER BY camp_date DESC'
        );
        res.json(camps);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Create new camp (admin only)
router.post('/', [verifyToken, isAdmin], async (req, res) => {
    console.log('POST /api/camps called');
    console.log('Request body:', req.body);
    const {
        camp_name,
        camp_date,
        area,
        district,
        mandal,
        coordinator,
        sponsor,
        agenda
    } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO camps (
                camp_name, camp_date, area, district, mandal,
                coordinator, sponsor, agenda, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                camp_name, camp_date, area, district, mandal,
                coordinator, sponsor, agenda, req.user.id
            ]
        );

        res.status(201).json({
            message: "Camp created successfully",
            campId: result.insertId
        });
    } catch (error) {
        console.error('Error creating camp:', error);
        res.status(500).json({ message: "Server error" });
    }
});

console.log('Camp routes loaded successfully');
module.exports = router;