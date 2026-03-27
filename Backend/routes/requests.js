const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// POST /api/requests - public (customer requests out-of-stock medicine)
router.post('/', async (req, res) => {
    const { customerName, phone, medicineName, quantity } = req.body;

    if (!customerName || !phone || !medicineName || !quantity) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        await db.query(
            'INSERT INTO medicine_requests (customer_name, phone, medicine_name, quantity) VALUES (?, ?, ?, ?)',
            [customerName, phone, medicineName, quantity]
        );
        res.status(201).json({ message: 'Request submitted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/requests - admin only
router.get('/', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM medicine_requests ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/requests/:id/status - admin only
router.put('/:id/status', verifyToken, async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Fulfilled', 'Rejected'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status.' });
    }

    try {
        await db.query('UPDATE medicine_requests SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Request status updated.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/requests/:id - admin only
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await db.query('DELETE FROM medicine_requests WHERE id = ?', [req.params.id]);
        res.json({ message: 'Request deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
