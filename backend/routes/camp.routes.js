const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const db = require('../config/database');

router.use((req, res, next) => {
  console.log(`[CAMP ROUTE] ${req.method} ${req.path}`);
  next();
});

// Get all camps
router.get('/', verifyToken, async (req, res) => {
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
  console.log('Creating camp with data:', req.body);
  console.log('User in request:', req.user);

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
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get camp by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const [camps] = await db.query(
      'SELECT * FROM camps WHERE camp_id = ?',
      [req.params.id]
    );

    if (camps.length === 0) {
      return res.status(404).json({ message: "Camp not found" });
    }

    res.json(camps[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update camp (admin only)
router.put('/:id', [verifyToken, isAdmin], async (req, res) => {
  console.log('Update request user:', req.user);
  console.log('Update request body:', req.body);
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
      `UPDATE camps SET
        camp_name = ?, camp_date = ?, area = ?, district = ?,
        mandal = ?, coordinator = ?, sponsor = ?, agenda = ?
      WHERE camp_id = ?`,
      [
        camp_name, camp_date, area, district,
        mandal, coordinator, sponsor, agenda,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Camp not found" });
    }

    res.json({ message: "Camp updated successfully" });
  } catch (error) {
    console.error(error);
    // return detailed error in dev to help debugging
    res.status(500).json({ message: error.message || "Server error" });
  }
});

module.exports = router;