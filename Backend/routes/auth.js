const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { JWT_SECRET, verifyToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: 'Username and password are required.' });

    try {
        const admin = await AdminUser.findOne({ username });
        if (!admin)
            return res.status(401).json({ error: 'Invalid username or password.' });

        let isValid = false;
        if (admin.password_hash.startsWith('$2')) {
            isValid = await bcrypt.compare(password, admin.password_hash);
        } else {
            isValid = (password === admin.password_hash);
        }

        if (!isValid)
            return res.status(401).json({ error: 'Invalid username or password.' });

        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            JWT_SECRET,
            { expiresIn: '8h' }
        );
        res.json({ token, username: admin.username });
    } catch (err) {
        res.status(500).json({ error: 'Server error.', details: err.message });
    }
});

// PUT /api/auth/update-credentials (protected)
router.put('/update-credentials', verifyToken, async (req, res) => {
    const { newUsername, newPassword } = req.body;
    if (!newUsername || !newPassword)
        return res.status(400).json({ error: 'New username and password are required.' });

    try {
        const hash = await bcrypt.hash(newPassword, 10);
        await AdminUser.findByIdAndUpdate(req.admin.id, { username: newUsername, password_hash: hash });
        res.json({ message: 'Credentials updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Server error.', details: err.message });
    }
});

module.exports = router;
