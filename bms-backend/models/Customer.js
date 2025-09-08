const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  address: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);