const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const product = await new Product({ ...req.body, businessId: req.user.id }).save();
    res.status(201).json(product);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ businessId: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product || product.businessId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.businessId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product removed' });
  } catch (err) { res.status(500).send('Server Error'); }
};