// controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

// @desc    Create a new sale transaction
exports.createSale = async (req, res) => {
  const { customerId, products, totalAmount } = req.body;
  
  if (!products || products.length === 0) {
    return res.status(400).json({ msg: 'No products in sale' });
  }

  try {
    // 1. Update stock for each product
    for (const item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // 2. Create the transaction
    const newTransaction = new Transaction({
      customerId,
      products,
      totalAmount,
      businessId: req.user.id,
    });

    const transaction = await newTransaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all sales transactions
exports.getSales = async (req, res) => {
    try {
        const sales = await Transaction.find({ businessId: req.user.id })
            .populate('customerId', 'name') // Get customer's name
            .sort({ transactionDate: -1 });
        res.json(sales);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};