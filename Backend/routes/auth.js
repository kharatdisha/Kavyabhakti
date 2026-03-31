const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { JWT_SECRET, verifyToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const admin = await AdminUser.findOne({ username });

        // ❌ Reject if admin not found or password_hash is missing
        if (!admin || !admin.password_hash) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        let isValid = false;

        // ✅ Safely check if password_hash is a bcrypt hash
        if (typeof admin.password_hash === 'string' && admin.password_hash.startsWith('$2')) {
            isValid = await bcrypt.compare(password, admin.password_hash);
        } else {
            // fallback for plain-text passwords (if any exist)
            isValid = password === admin.password_hash;
        }

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // generate JWT token
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, username: admin.username });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error.', details: err.message });
    }
});

// PUT /api/auth/update-credentials (protected)
router.put('/update-credentials', verifyToken, async (req, res) => {
    const { newUsername, newPassword } = req.body;
    if (!newUsername || !newPassword) {
        return res.status(400).json({ error: 'New username and password are required.' });
    }

    try {
        // hash the new password
        const hash = await bcrypt.hash(newPassword, 10);

        // update credentials safely
        const updatedAdmin = await AdminUser.findByIdAndUpdate(
            req.admin.id,
            { username: newUsername, password_hash: hash },
            { new: true } // return the updated document
        );

        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin not found.' });
        }

        res.json({ message: 'Credentials updated successfully.', username: updatedAdmin.username });

    } catch (err) {
        console.error('Update credentials error:', err);
        res.status(500).json({ error: 'Server error.', details: err.message });
    }
});

module.exports = router;