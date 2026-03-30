const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    email: { type: String, default: '' }
}, { timestamps: true });

customerSchema.index({ phone: 1 });

module.exports = mongoose.model('Customer', customerSchema);
