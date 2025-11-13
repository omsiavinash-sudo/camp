const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.path}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    next();
});

app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Test route to verify basic routing works
app.get('/test', (req, res) => {
    res.json({ message: 'Basic routing works' });
});

// Root route
app.get('/', (req, res) => {
    res.send('Camp Management API is running.');
});

// Load and register routes with error handling
try {
    const authRoutes = require('./routes/auth.routes');
    const userRoutes = require('./routes/user.routes');
    const campRoutes = require('./routes/camp.routes');
    const testRoutes = require('./routes/test.routes');

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/camps', campRoutes);
    app.use('/api/test', testRoutes);

    console.log('Routes registered successfully');
} catch (error) {
    console.error('Error registering routes:', error);
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.path);
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- GET  /');
    console.log('- GET  /test');
    console.log('- POST /api/auth/login');
    console.log('- GET  /api/camps');
    console.log('- POST /api/camps');
});