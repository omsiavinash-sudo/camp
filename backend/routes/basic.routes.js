const express = require('express');
const router = express.Router();

// Basic test route that doesn't require auth
router.get('/test', (req, res) => {
    res.json({ message: 'Basic camp route works' });
});

router.post('/test', (req, res) => {
    res.json({ message: 'POST camp route works', body: req.body });
});

module.exports = router;