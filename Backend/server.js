require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Make sure db.js is setup
const app = express();
const PORT = process.env.PORT || 3000;

// Parse allowed origins from .env
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : [];

// CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow Postman / server-side requests
    if (allowedOrigins.includes(origin)) return callback(null, true); // Allow exact matches
    console.log('Blocked by CORS:', origin); // Log blocked requests
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// JSON parser with body limit
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/requests',  require('./routes/requests'));
app.use('/api/billing',   require('./routes/billing'));
app.use('/api/reports',   require('./routes/reports'));
app.use('/api/contact',   require('./routes/contact'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Kavyabhakti Medical Store API is running.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message
  });
});

// Start server after testing DB connection
db.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected successfully.');
    conn.release();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  });