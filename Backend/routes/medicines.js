const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// GET /api/medicines - public, returns all medicines with category name
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.*, c.name AS category_name, c.image_path AS category_image
            FROM medicines m
            JOIN categories c ON m.category_id = c.id
            ORDER BY c.name, m.name
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/medicines/categories - public
router.get('/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories ORDER BY name');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/medicines/category/:categoryName - public
router.get('/category/:categoryName', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.*, c.name AS category_name
            FROM medicines m
            JOIN categories c ON m.category_id = c.id
            WHERE c.name = ?
            ORDER BY m.name
        `, [req.params.categoryName]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/medicines/search?q=term - public
router.get('/search', async (req, res) => {
    const q = `%${req.query.q || ''}%`;
    try {
        const [rows] = await db.query(`
            SELECT m.*, c.name AS category_name
            FROM medicines m
            JOIN categories c ON m.category_id = c.id
            WHERE m.name LIKE ? OR m.brand LIKE ? OR c.name LIKE ?
            ORDER BY m.name
        `, [q, q, q]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/medicines/:id - public
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.*, c.name AS category_name
            FROM medicines m
            JOIN categories c ON m.category_id = c.id
            WHERE m.id = ?
        `, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Medicine not found.' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/medicines - admin only
router.post('/', verifyToken, async (req, res) => {
    const { name, brand, description, category_id, image_path, purchase_price, selling_price, gst_percent, stock, expiry_date, location } = req.body;

    if (!name || !brand || !category_id || !selling_price) {
        return res.status(400).json({ error: 'Name, brand, category, and selling price are required.' });
    }

    try {
        const [result] = await db.query(`
            INSERT INTO medicines (name, brand, description, category_id, image_path, purchase_price, selling_price, gst_percent, stock, expiry_date, location, is_available)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [name, brand, description || '', category_id, image_path || 'index_images/Medical.jpg',
            purchase_price || 0, selling_price, gst_percent || 5, stock || 0,
            expiry_date || null, location || '', stock > 0 ? 1 : 0]);

        res.status(201).json({ message: 'Medicine added.', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/medicines/:id - admin only
router.put('/:id', verifyToken, async (req, res) => {
    const { name, brand, description, category_id, image_path, purchase_price, selling_price, gst_percent, stock, expiry_date, location, is_available } = req.body;

    try {
        await db.query(`
            UPDATE medicines SET
                name = ?, brand = ?, description = ?, category_id = ?, image_path = ?,
                purchase_price = ?, selling_price = ?, gst_percent = ?,
                stock = ?, expiry_date = ?, location = ?, is_available = ?
            WHERE id = ?
        `, [name, brand, description, category_id, image_path,
            purchase_price, selling_price, gst_percent,
            stock, expiry_date, location, is_available, req.params.id]);

        res.json({ message: 'Medicine updated.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/medicines/:id - admin only
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await db.query('DELETE FROM medicines WHERE id = ?', [req.params.id]);
        res.json({ message: 'Medicine deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
