const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const svgCaptcha = require('svg-captcha');
const db = require('../config/database');

// Generate captcha
router.get('/captcha', (req, res) => {
  const captcha = svgCaptcha.create({
    size: 6,
    noise: 2,
    width: 150,
    height: 50,
    charPreset: '0123456789'
  });
  req.session.captcha = captcha.text;
  res.type('svg').send(captcha.data);
});

// Login route

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt for username/mobile:', username);

  try {
    // Get user from database (allow login with username or mobile)
    const [users] = await db.query(
      'SELECT u.*, r.role_name FROM users u JOIN roles r ON u.role_id = r.role_id WHERE username = ? OR mobile = ?',
      [username, username]
    );
    console.log('Query result:', users.length ? 'User found' : 'User not found');

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user.user_id,
        role: user.role_name,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        username: user.username,
        role: user.role_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;