const express = require('express');
const router = express.Router();
const { register, login, getMe, updateUserDetails } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/update', auth, updateUserDetails);

module.exports = router;