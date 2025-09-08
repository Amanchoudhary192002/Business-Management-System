const mongoose = require('mongoose'); // Make sure mongoose is imported
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

// @desc    Get key dashboard reports
exports.getReports = async (req, res) => {
  try {
    const businessId = req.user.id;

    // 1. Daily Sales Summary
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const dailySales = await Transaction.aggregate([
      { $match: { businessId: new mongoose.Types.ObjectId(businessId), transactionDate: { $gte: startOfDay, $lte: endOfDay } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // 2. Low Stock Products (stock < 10)
    const lowStockProducts = await Product.find({ businessId, stock: { $lt: 10 } }).sort({ stock: 1 });

    // 3. Top Customers (by total spending)
    const topCustomers = await Transaction.aggregate([
        { $match: { businessId: new mongoose.Types.ObjectId(businessId) } },
        { $group: { _id: '$customerId', totalSpent: { $sum: '$totalAmount' } } },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'customers', localField: '_id', foreignField: '_id', as: 'customerDetails' } },
        { $unwind: '$customerDetails' },
        { $project: { name: '$customerDetails.name', totalSpent: 1, _id: 0 } }
    ]);

    res.json({
      dailySalesTotal: dailySales.length > 0 ? dailySales[0].total : 0,
      lowStockProducts,
      topCustomers,
    });
  } catch (err) {
    console.error(err.message); // This is what prints the error in your terminal
    res.status(500).send('Server Error');
  }
};