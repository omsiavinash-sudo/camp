const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Debug route works' });
});

// Echo route to see what's coming in
router.post('/echo', (req, res) => {
  res.json({
    headers: req.headers,
    body: req.body,
    method: req.method,
    url: req.url
  });
});

module.exports = router;