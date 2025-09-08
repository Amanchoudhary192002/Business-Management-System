const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Helper function to sign a JWT
const signToken = (userId) => {
  return jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
exports.register = async (req, res) => {
  const { businessName, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ businessName, email, password });
    await user.save();
    res.status(201).json({ token: signToken(user.id) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Login user & get token
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    res.json({ token: signToken(user.id) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get the logged in user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user details
exports.updateUserDetails = async (req, res) => {
  const { businessName, email } = req.body;
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email is already in use' });
      }
      user.email = email;
    }

    if (businessName) {
      user.businessName = businessName;
    }

    await user.save();
    res.json(user);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};