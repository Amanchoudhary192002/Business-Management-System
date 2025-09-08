// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      priceAtSale: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);