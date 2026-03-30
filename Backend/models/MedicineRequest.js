const mongoose = require('mongoose');

const medicineRequestSchema = new mongoose.Schema({
    customer_name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    medicine_name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, default: 1 },
    status: { type: String, enum: ['Pending', 'Fulfilled', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('MedicineRequest', medicineRequestSchema);
