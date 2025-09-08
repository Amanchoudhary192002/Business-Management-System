const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);