const express = require('express');
const router = express.Router();
const { getReports } = require('../controllers/reportController');
const auth = require('../middleware/authMiddleware');

router.route('/').get(auth, getReports);

module.exports = router;