const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const Category = require('../models/Category');
const { verifyToken } = require('../middleware/auth');

// GET /api/medicines - public
router.get('/', async (req, res) => {
    try {
        const medicines = await Medicine.find().populate('category_id', 'name image_path').sort({ name: 1 });
        const result = medicines.map(m => ({
            ...m.toObject(),
            category_name: m.category_id?.name,
            category_image: m.category_id?.image_path
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/medicines/categories - public
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/medicines/search?q=term - public
router.get('/search', async (req, res) => {
    const q = req.query.q || '';
    try {
        const regex = new RegExp(q, 'i');
        const categories = await Category.find({ name: regex }).select('_id');
        const categoryIds = categories.map(c => c._id);

        const medicines = await Medicine.find({
            $or: [{ name: regex }, { brand: regex }, { category_id: { $in: categoryIds } }]
        }).populate('category_id', 'name').sort({ name: 1 });

        const result = medicines.map(m => ({
            ...m.toObject(),
            category_name: m.category_id?.name
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/medicines/category/:categoryName - public
router.get('/category/:categoryName', async (req, res) => {
    try {
        const category = await Category.findOne({ name: req.params.categoryName });
        if (!category) return res.json([]);

        const medicines = await Medicine.find({ category_id: category._id })
            .populate('category_id', 'name').sort({ name: 1 });

        const result = medicines.map(m => ({
            ...m.toObject(),
            category_name: m.category_id?.name
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/medicines/:id - public
router.get('/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id).populate('category_id', 'name');
        if (!medicine) return res.status(404).json({ error: 'Medicine not found.' });
        res.json({ ...medicine.toObject(), category_name: medicine.category_id?.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/medicines - admin only
router.post('/', verifyToken, async (req, res) => {
    const { name, brand, description, category_id, image_path, purchase_price, selling_price, gst_percent, stock, expiry_date, location } = req.body;

    if (!name || !brand || !category_id || !selling_price)
        return res.status(400).json({ error: 'Name, brand, category, and selling price are required.' });

    try {
        const medicine = await Medicine.create({
            name, brand,
            description: description || '',
            category_id,
            image_path: image_path || 'index_images/Medical.jpg',
            purchase_price: purchase_price || 0,
            selling_price,
            gst_percent: gst_percent || 5,
            stock: stock || 0,
            expiry_date: expiry_date || null,
            location: location || '',
            is_available: (stock || 0) > 0
        });
        res.status(201).json({ message: 'Medicine added.', id: medicine._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/medicines/:id - admin only
router.put('/:id', verifyToken, async (req, res) => {
    try {
        await Medicine.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'Medicine updated.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/medicines/:id - admin only
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Medicine.findByIdAndDelete(req.params.id);
        res.json({ message: 'Medicine deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
