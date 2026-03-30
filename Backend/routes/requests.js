const express = require('express');
const router = express.Router();
const MedicineRequest = require('../models/MedicineRequest');
const { verifyToken } = require('../middleware/auth');

// POST /api/requests - public
router.post('/', async (req, res) => {
    const { customerName, phone, medicineName, quantity } = req.body;

    if (!customerName || !phone || !medicineName || !quantity)
        return res.status(400).json({ error: 'All fields are required.' });

    try {
        await MedicineRequest.create({ customer_name: customerName, phone, medicine_name: medicineName, quantity });
        res.status(201).json({ message: 'Request submitted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/requests - admin only
router.get('/', verifyToken, async (req, res) => {
    try {
        const requests = await MedicineRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/requests/:id/status - admin only
router.put('/:id/status', verifyToken, async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Fulfilled', 'Rejected'];

    if (!validStatuses.includes(status))
        return res.status(400).json({ error: 'Invalid status.' });

    try {
        await MedicineRequest.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: 'Request status updated.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/requests/:id - admin only
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await MedicineRequest.findByIdAndDelete(req.params.id);
        res.json({ message: 'Request deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
