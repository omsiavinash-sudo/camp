
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const db = require('../config/database');
// Delete a user (admin only)
router.delete('/:user_id', verifyToken, isAdmin, async (req, res) => {
  const { user_id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all roles
router.get('/roles', verifyToken, isAdmin, async (req, res) => {
  try {
    const [roles] = await db.query('SELECT * FROM roles');
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new user (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { username, mobile, password, role_id, email } = req.body;
  if (!username || !mobile || !password || !role_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const password_hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (username, mobile, password_hash, role_id, email) VALUES (?, ?, ?, ?, ?)',
      [username, mobile, password_hash, role_id, email]
    );
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: 'Username or mobile already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// List all users (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const [users] = await db.query('SELECT user_id, username, mobile, role_id, email FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
