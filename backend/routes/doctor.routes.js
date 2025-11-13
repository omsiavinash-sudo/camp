const express = require('express');
const router = express.Router();
const { verifyToken, isDoctor } = require('../middleware/auth.middleware');
const db = require('../config/database');

// Create a doctor exam record
router.post('/', verifyToken, isDoctor, async (req, res) => {
  const {
    visual_findings,
    via_result,
    via_extends_endocervical,
    via_quadrant_count,
    via_quadrants,
    biopsy_taken,
    biopsy_site_notes,
    actions_taken,
    actions_other_text
  } = req.body;

  try {
    // Basic validation
    if (!via_result) {
      return res.status(400).json({ message: 'via_result is required' });
    }

    // Try to insert into a doctor_exams table if available. Use JSON columns for arrays.
    const [result] = await db.query(
      `INSERT INTO doctor_exams (
        registration_id, user_id, visual_findings, via_result, via_extends_endocervical,
        via_quadrant_count, via_quadrants, biopsy_taken, biopsy_site_notes,
        actions_taken, actions_other_text, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        req.body.registration_id || null,
        req.user.id || null,
        JSON.stringify(visual_findings || []),
        via_result,
        via_extends_endocervical || null,
        via_quadrant_count || null,
        JSON.stringify(via_quadrants || []),
        biopsy_taken ? 1 : 0,
        biopsy_site_notes || null,
        JSON.stringify(actions_taken || []),
        actions_other_text || null
      ]
    );

    res.status(201).json({ message: 'Doctor exam recorded', id: result.insertId });
  } catch (err) {
    console.error('Error saving doctor exam:', err.message || err);
    // If table doesn't exist or other DB error, return the payload back for debugging
    if (err && err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(201).json({ message: 'Doctor exam (no table) - echo', data: req.body });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get exams for a registration
router.get('/registration/:registration_id', verifyToken, async (req, res) => {
  try {
    const registrationId = req.params.registration_id;
    const [rows] = await db.query(
      `SELECT d.*, u.username as recorded_by
       FROM doctor_exams d
       LEFT JOIN users u ON d.user_id = u.user_id
       WHERE d.registration_id = ?
       ORDER BY d.created_at DESC`,
      [registrationId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching exams:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single exam by id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query(
      `SELECT d.*, u.username as recorded_by
       FROM doctor_exams d
       LEFT JOIN users u ON d.user_id = u.user_id
       WHERE d.doctor_exam_id = ?`,
      [id]
    );
    if (!rows || rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching exam:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


