const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// Generate next bill number
async function getNextBillNumber() {
    const [rows] = await db.query('SELECT bill_number FROM bills ORDER BY id DESC LIMIT 1');
    if (rows.length === 0) return 'BILL001';
    const last = rows[0].bill_number;
    const num = parseInt(last.replace('BILL', '')) + 1;
    return 'BILL' + String(num).padStart(3, '0');
}

// POST /api/billing - admin only (create/save bill)
router.post('/', verifyToken, async (req, res) => {
    const { customerName, customerPhone, paymentMethod, items, discount } = req.body;
    // items: [{ medicine_id, medicine_name, brand, quantity, unit_price, expiry_date }]

    if (!customerName || !items || items.length === 0) {
        return res.status(400).json({ error: 'Customer name and items are required.' });
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const subtotal = items.reduce((sum, i) => sum + (i.unit_price * i.quantity), 0);
        const discountAmt = parseFloat(discount) || 0;
        const gstAmount = parseFloat(((subtotal - discountAmt) * 0.05).toFixed(2));
        const finalTotal = parseFloat((subtotal - discountAmt + gstAmount).toFixed(2));
        const billNumber = await getNextBillNumber();
        const billingDate = new Date().toISOString().split('T')[0];

        const [billResult] = await conn.query(`
            INSERT INTO bills (bill_number, customer_name, customer_phone, payment_method, subtotal, discount, gst_amount, final_total, billing_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [billNumber, customerName, customerPhone || '', paymentMethod || 'Cash',
            subtotal, discountAmt, gstAmount, finalTotal, billingDate]);

        const billId = billResult.insertId;

        for (const item of items) {
            await conn.query(`
                INSERT INTO bill_items (bill_id, medicine_id, medicine_name, brand, quantity, unit_price, expiry_date, total_price)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [billId, item.medicine_id, item.medicine_name, item.brand || '',
                item.quantity, item.unit_price, item.expiry_date || null,
                item.unit_price * item.quantity]);

            // Deduct stock
            await conn.query(
                'UPDATE medicines SET stock = stock - ?, is_available = IF(stock - ? <= 0, 0, 1) WHERE id = ?',
                [item.quantity, item.quantity, item.medicine_id]
            );
        }

        await conn.commit();
        res.status(201).json({ message: 'Bill saved.', billId, billNumber, finalTotal });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// GET /api/billing - admin only (billing history)
router.get('/', verifyToken, async (req, res) => {
    try {
        const [bills] = await db.query('SELECT * FROM bills ORDER BY billing_date DESC, id DESC');

        for (const bill of bills) {
            const [items] = await db.query(
                'SELECT * FROM bill_items WHERE bill_id = ?', [bill.id]
            );
            bill.items = items;
        }

        res.json(bills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/billing/:id - admin only
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const [bills] = await db.query('SELECT * FROM bills WHERE id = ?', [req.params.id]);
        if (bills.length === 0) return res.status(404).json({ error: 'Bill not found.' });

        const [items] = await db.query('SELECT * FROM bill_items WHERE bill_id = ?', [req.params.id]);
        bills[0].items = items;

        res.json(bills[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/billing/:id - admin only
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await db.query('DELETE FROM bills WHERE id = ?', [req.params.id]);
        res.json({ message: 'Bill deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
