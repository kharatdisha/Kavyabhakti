const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    image_path: { type: String, default: 'index_images/Medical.jpg' }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
