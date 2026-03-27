const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM admin_users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const admin = rows[0];

        // Support plain text password for initial setup (admin123)
        let isValid = false;
        if (admin.password_hash.startsWith('$2')) {
            isValid = await bcrypt.compare(password, admin.password_hash);
        } else {
            isValid = (password === admin.password_hash);
        }

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

        res.json({ token, username: admin.username });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// PUT /api/auth/update-credentials (protected)
const { verifyToken } = require('../middleware/auth');
router.put('/update-credentials', verifyToken, async (req, res) => {
    const { newUsername, newPassword } = req.body;

    if (!newUsername || !newPassword) {
        return res.status(400).json({ error: 'New username and password are required.' });
    }

    try {
        const hash = await bcrypt.hash(newPassword, 10);
        await db.query(
            'UPDATE admin_users SET username = ?, password_hash = ? WHERE id = ?',
            [newUsername, hash, req.admin.id]
        );
        res.json({ message: 'Credentials updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

module.exports = router;
