const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// POST /api/orders - public (customer places order)
router.post('/', async (req, res) => {
    const { customerName, phone, address, items } = req.body;
    // items: [{ medicine_id, medicine_name, quantity, unit_price }]

    if (!customerName || !phone || !items || items.length === 0) {
        return res.status(400).json({ error: 'Customer name, phone, and items are required.' });
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Upsert customer
        let customerId;
        const [existing] = await conn.query('SELECT id FROM customers WHERE phone = ?', [phone]);
        if (existing.length > 0) {
            customerId = existing[0].id;
            await conn.query('UPDATE customers SET name = ?, address = ? WHERE id = ?', [customerName, address || '', customerId]);
        } else {
            const [result] = await conn.query(
                'INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)',
                [customerName, phone, address || '']
            );
            customerId = result.insertId;
        }

        // Calculate total
        const total = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

        // Create order
        const [orderResult] = await conn.query(
            'INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, ?)',
            [customerId, total, 'Pending']
        );
        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of items) {
            await conn.query(
                'INSERT INTO order_items (order_id, medicine_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.medicine_id, item.quantity, item.unit_price, item.unit_price * item.quantity]
            );
        }

        await conn.commit();
        res.status(201).json({ message: 'Order placed successfully.', orderId });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// GET /api/orders - admin only
router.get('/', verifyToken, async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.id, o.status, o.total_amount, o.created_at,
                   c.name AS customer_name, c.phone, c.address
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            ORDER BY o.created_at DESC
        `);

        // Attach items to each order
        for (const order of orders) {
            const [items] = await db.query(`
                SELECT oi.quantity, oi.unit_price, oi.total_price, m.name AS medicine_name
                FROM order_items oi
                JOIN medicines m ON oi.medicine_id = m.id
                WHERE oi.order_id = ?
            `, [order.id]);
            order.medicines = items;
        }

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/orders/:id/status - admin only
router.put('/:id/status', verifyToken, async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status.' });
    }

    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Order status updated.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
