const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Medicine = require('../models/Medicine');
const { verifyToken } = require('../middleware/auth');

// GET /api/reports?startMonth=01&endMonth=03&year=2026 - admin only
router.get('/', verifyToken, async (req, res) => {
    const { startMonth, endMonth, year } = req.query;

    if (!startMonth || !endMonth || !year)
        return res.status(400).json({ error: 'startMonth, endMonth, and year are required.' });

    const startDate = new Date(`${year}-${startMonth}-01`);
    const endDate = new Date(`${year}-${endMonth}-31`);
    endDate.setHours(23, 59, 59, 999);

    try {
        const bills = await Bill.find({ billing_date: { $gte: startDate, $lte: endDate } })
            .sort({ billing_date: -1 });

        // Gather all unique medicine IDs to fetch purchase prices
        const medicineIds = [...new Set(
            bills.flatMap(b => b.items.map(i => i.medicine_id.toString()))
        )];
        const medicines = await Medicine.find({ _id: { $in: medicineIds } }).select('_id purchase_price');
        const priceMap = {};
        medicines.forEach(m => { priceMap[m._id.toString()] = m.purchase_price; });

        let totalBills = bills.length;
        let medicinesSold = 0;
        let revenue = 0;
        let gstCollected = 0;
        let purchaseCost = 0;

        const billDetails = bills.map(bill => {
            const billPurchaseCost = bill.items.reduce((sum, item) => {
                const pp = priceMap[item.medicine_id.toString()] || 0;
                return sum + (pp * item.quantity);
            }, 0);

            medicinesSold += bill.items.reduce((sum, i) => sum + i.quantity, 0);
            revenue += bill.final_total;
            gstCollected += bill.gst_amount;
            purchaseCost += billPurchaseCost;

            return {
                id: bill._id,
                bill_number: bill.bill_number,
                customer_name: bill.customer_name,
                billing_date: bill.billing_date,
                revenue: bill.final_total,
                gst_amount: bill.gst_amount,
                purchase_cost: parseFloat(billPurchaseCost.toFixed(2)),
                profit: parseFloat((bill.final_total - billPurchaseCost).toFixed(2)),
                medicines: bill.items.map(i => i.medicine_name).join(', ')
            };
        });

        const profit = revenue - purchaseCost;

        res.json({
            summary: {
                totalBills,
                medicinesSold,
                revenue: revenue.toFixed(2),
                gstCollected: gstCollected.toFixed(2),
                purchaseCost: purchaseCost.toFixed(2),
                profit: profit.toFixed(2)
            },
            bills: billDetails
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
