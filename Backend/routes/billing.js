const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Medicine = require('../models/Medicine');
const { verifyToken } = require('../middleware/auth');

async function getNextBillNumber() {
    const last = await Bill.findOne().sort({ createdAt: -1 }).select('bill_number');
    if (!last) return 'BILL001';
    const num = parseInt(last.bill_number.replace('BILL', '')) + 1;
    return 'BILL' + String(num).padStart(3, '0');
}

// POST /api/billing - admin only
router.post('/', verifyToken, async (req, res) => {
    const { customerName, customerPhone, paymentMethod, items, discount } = req.body;

    if (!customerName || !items || items.length === 0)
        return res.status(400).json({ error: 'Customer name and items are required.' });

    try {
        const subtotal = items.reduce((sum, i) => sum + (i.unit_price * i.quantity), 0);
        const discountAmt = parseFloat(discount) || 0;
        const gstAmount = parseFloat(((subtotal - discountAmt) * 0.05).toFixed(2));
        const finalTotal = parseFloat((subtotal - discountAmt + gstAmount).toFixed(2));
        const billNumber = await getNextBillNumber();

        const bill = await Bill.create({
            bill_number: billNumber,
            customer_name: customerName,
            customer_phone: customerPhone || '',
            payment_method: paymentMethod || 'Cash',
            subtotal,
            discount: discountAmt,
            gst_amount: gstAmount,
            final_total: finalTotal,
            billing_date: new Date(),
            items: items.map(item => ({
                medicine_id: item.medicine_id,
                medicine_name: item.medicine_name,
                brand: item.brand || '',
                quantity: item.quantity,
                unit_price: item.unit_price,
                expiry_date: item.expiry_date || null,
                total_price: item.unit_price * item.quantity
            }))
        });

        // Deduct stock for each medicine
        for (const item of items) {
            await Medicine.findByIdAndUpdate(item.medicine_id, {
                $inc: { stock: -item.quantity },
                $set: { is_available: true } // will be corrected below
            });
            const med = await Medicine.findById(item.medicine_id).select('stock');
            if (med && med.stock <= 0) {
                await Medicine.findByIdAndUpdate(item.medicine_id, { is_available: false });
            }
        }

        res.status(201).json({ message: 'Bill saved.', billId: bill._id, billNumber, finalTotal });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/billing - admin only
router.get('/', verifyToken, async (req, res) => {
    try {
        const bills = await Bill.find().sort({ billing_date: -1, createdAt: -1 });

        const result = bills.map(bill => ({
            ...bill.toObject(),
            customer_phone: bill.customer_phone || 'N/A'
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/billing/:id - admin only
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ error: 'Bill not found.' });
        res.json(bill);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/billing/:id - admin only
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Bill.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bill deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
