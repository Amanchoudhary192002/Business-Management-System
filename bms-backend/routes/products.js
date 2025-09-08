const express = require('express');
const router = express.Router();
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

router.route('/').post(auth, createProduct).get(auth, getProducts);
router.route('/:id').put(auth, updateProduct).delete(auth, deleteProduct);

module.exports = router;