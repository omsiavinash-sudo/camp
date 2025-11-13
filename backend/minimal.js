const express = require('express');
const app = express();

// Minimal middleware
app.use(express.json());

// Debug logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Test routes
const basicRoutes = require('./routes/basic.routes');
app.use('/api/test', basicRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

app.listen(5001, () => {
    console.log('Test server running on port 5001');
});