const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image_path: { type: String, default: 'index_images/Medical.jpg' },
    purchase_price: { type: Number, default: 0 },
    selling_price: { type: Number, required: true, default: 0 },
    gst_percent: { type: Number, default: 5 },
    stock: { type: Number, default: 0 },
    expiry_date: { type: Date, default: null },
    location: { type: String, default: '' },
    is_available: { type: Boolean, default: true }
}, { timestamps: true });

medicineSchema.index({ category_id: 1 });
medicineSchema.index({ name: 1 });
medicineSchema.index({ expiry_date: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);
