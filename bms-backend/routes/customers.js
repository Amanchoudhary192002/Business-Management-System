const express = require('express');
const router = express.Router();
const { createCustomer, getCustomers, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const auth = require('../middleware/authMiddleware');

router.route('/').post(auth, createCustomer).get(auth, getCustomers);
router.route('/:id').put(auth, updateCustomer).delete(auth, deleteCustomer);

module.exports = router;