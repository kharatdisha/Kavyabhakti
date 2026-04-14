const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const { verifyToken } = require('../middleware/auth');

// POST /api/orders - public
router.post('/', async (req, res) => {
    const { customerName, phone, address, medicines  } = req.body;

   if (!customerName || !phone || !medicines || medicines.length === 0)
    return res.status(400).json({ error: 'Customer name, phone, and medicines are required.' });

// ✅ Clean phone
const cleanPhone = phone.trim();

// ✅ Validate phone
const phonePattern = /^[6-9][0-9]{9}$/;

if (!phonePattern.test(cleanPhone)) {
    return res.status(400).json({
        error: 'Invalid phone number. Must be 10 digits starting with 6-9.'
    });
}

    try {
        // Upsert customer
        let customer = await Customer.findOne({ phone: cleanPhone });
        if (customer) {
            customer.name = customerName;
            customer.address = address || '';
            await customer.save();
        } else {
            customer = await Customer.create({ name: customerName, phone: cleanPhone, address: address || '' });
        }

const total = medicines.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
        const order = await Order.create({
            customer_id: customer._id,
            total_amount: total,
            status: 'Pending',
            items: medicines.map(item => ({
                medicine_id: item.medicine_id,
                medicine_name: item.medicine_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.unit_price * item.quantity
            }))
        });

        res.status(201).json({ message: 'Order placed successfully.', orderId: order._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/orders - admin only
router.get('/', verifyToken, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer_id', 'name phone address')
            .sort({ createdAt: -1 });

        const result = orders.map(o => ({
            ...o.toObject(),
            customer_name: o.customer_id?.name,
            phone: o.customer_id?.phone,
            address: o.customer_id?.address,
            medicines: o.items
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/orders/:id/status - admin only
router.put('/:id/status', verifyToken, async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status))
        return res.status(400).json({ error: 'Invalid status.' });

    try {
        await Order.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: 'Order status updated.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
