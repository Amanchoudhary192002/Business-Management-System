const express = require('express');
const router = express.Router();
const { createSale, getSales } = require('../controllers/transactionController');
const auth = require('../middleware/authMiddleware');

router.route('/').post(auth, createSale).get(auth, getSales);

module.exports = router;