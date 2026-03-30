const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    medicine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    medicine_name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unit_price: { type: Number, required: true },
    total_price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'], default: 'Pending' },
    total_amount: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    items: [orderItemSchema]
}, { timestamps: true });

orderSchema.index({ customer_id: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
