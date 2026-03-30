const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
    medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    medicine_name: { type: String, required: true },
    brand: { type: String, default: '' },
    quantity: { type: Number, required: true, default: 1 },
    unit_price: { type: Number, required: true },
    expiry_date: { type: Date, default: null },
    total_price: { type: Number, required: true }
}, { _id: false });

const billSchema = new mongoose.Schema({
    bill_number: { type: String, required: true, unique: true },
    customer_name: { type: String, required: true, trim: true },
    customer_phone: { type: String, default: '' },
    payment_method: { type: String, enum: ['Cash', 'UPI', 'Card'], default: 'Cash' },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    gst_amount: { type: Number, default: 0 },
    final_total: { type: Number, default: 0 },
    billing_date: { type: Date, required: true },
    items: [billItemSchema]
}, { timestamps: true });

billSchema.index({ billing_date: 1 });

module.exports = mongoose.model('Bill', billSchema);
