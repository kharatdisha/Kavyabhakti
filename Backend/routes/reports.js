const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// GET /api/reports?startMonth=01&endMonth=03&year=2026 - admin only
router.get('/', verifyToken, async (req, res) => {
    const { startMonth, endMonth, year } = req.query;

    if (!startMonth || !endMonth || !year) {
        return res.status(400).json({ error: 'startMonth, endMonth, and year are required.' });
    }

    const startDate = `${year}-${startMonth}-01`;
    const endDate   = `${year}-${endMonth}-31`;

    try {
        // Summary totals
        const [summary] = await db.query(`
            SELECT
                COUNT(DISTINCT b.id)            AS total_bills,
                COALESCE(SUM(bi.quantity), 0)   AS medicines_sold,
                COALESCE(SUM(b.final_total), 0) AS revenue,
                COALESCE(SUM(b.gst_amount), 0)  AS gst_collected,
                COALESCE(SUM(bi.quantity * m.purchase_price), 0) AS purchase_cost
            FROM bills b
            JOIN bill_items bi ON bi.bill_id = b.id
            JOIN medicines m ON m.id = bi.medicine_id
            WHERE b.billing_date BETWEEN ? AND ?
        `, [startDate, endDate]);

        const s = summary[0];
        const profit = parseFloat(s.revenue) - parseFloat(s.purchase_cost);

        // Per-bill breakdown
        const [bills] = await db.query(`
            SELECT
                b.id, b.bill_number, b.customer_name, b.billing_date,
                b.final_total AS revenue, b.gst_amount,
                COALESCE(SUM(bi.quantity * m.purchase_price), 0) AS purchase_cost,
                GROUP_CONCAT(bi.medicine_name SEPARATOR ', ') AS medicines
            FROM bills b
            JOIN bill_items bi ON bi.bill_id = b.id
            JOIN medicines m ON m.id = bi.medicine_id
            WHERE b.billing_date BETWEEN ? AND ?
            GROUP BY b.id
            ORDER BY b.billing_date DESC
        `, [startDate, endDate]);

        // Add profit per bill
        bills.forEach(bill => {
            bill.profit = parseFloat(bill.revenue) - parseFloat(bill.purchase_cost);
        });

        res.json({
            summary: {
                totalBills:    s.total_bills,
                medicinesSold: s.medicines_sold,
                revenue:       parseFloat(s.revenue).toFixed(2),
                gstCollected:  parseFloat(s.gst_collected).toFixed(2),
                purchaseCost:  parseFloat(s.purchase_cost).toFixed(2),
                profit:        profit.toFixed(2)
            },
            bills
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
