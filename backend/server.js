// server.js (updated)

const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

// Allowed origins (add other allowed origins if needed)
const allowedOrigins = [
  'http://13.234.168.116',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

// --- CORS middleware (dynamic origin check) ---
// Use cors() for normal requests, but also provide a safe preflight handler below.
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, mobile clients)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Global preflight handler (handle OPTIONS before router parsing) ---
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (!origin) {
      // no origin (curl etc.) — allow
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else {
      // echo back default allowed origin if origin not allowed
      res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return res.sendStatus(204);
  }
  next();
});

// --- session (adjust secure:true in production with HTTPS) ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// --- simple request logger ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} origin=${req.headers.origin || 'no-origin'}`);
  next();
});

// --- routes ---
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const campRoutes = require('./routes/camp.routes');
const registrationRoutes = require('./routes/registration.routes');
const doctorRoutes = require('./routes/doctor.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/camps', campRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/doctor-exams', doctorRoutes);

// --- 404 handler (include CORS headers) ---
app.use((req, res) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(404).json({ message: 'Route not found' });
});

// --- error handler (ensure CORS headers are present on errors) ---
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  res.status(err.status || 500).json({ message: 'Server error', error: err.message || 'internal error' });
});

// --- start server (bind to 0.0.0.0 so it's reachable externally) ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
