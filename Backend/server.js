require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
require('./db');

// CORS — allow only the configured frontend origin
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/requests',  require('./routes/requests'));
app.use('/api/billing',   require('./routes/billing'));
app.use('/api/reports',   require('./routes/reports'));
app.use('/api/contact',   require('./routes/contact'));

// Health check
app.get('/', (_req, res) => {
    res.json({ status: 'Kavyabhakti Medical Store API is running.' });
});

// Global error handler
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
