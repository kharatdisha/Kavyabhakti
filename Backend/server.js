require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS — restrict to frontend origin in production
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
    : ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// Limit JSON body size to prevent abuse
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

// Global error handler — never leak stack traces in production
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message
    });
});

// Test DB connection then start server
const db = require('./db');
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
