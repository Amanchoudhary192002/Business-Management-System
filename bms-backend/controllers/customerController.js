const Customer = require('../models/Customer');

exports.createCustomer = async (req, res) => {
  try {
    const customer = await new Customer({ ...req.body, businessId: req.user.id }).save();
    res.status(201).json(customer);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ businessId: req.user.id }).sort({ name: 1 });
    res.json(customers);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.updateCustomer = async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer || customer.businessId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(customer);
  } catch (err) { res.status(500).send('Server Error'); }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer || customer.businessId.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Customer not found' });
    }
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Customer removed' });
  } catch (err) { res.status(500).send('Server Error'); }
};