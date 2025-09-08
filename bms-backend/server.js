const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const User = require('./models/User');

const app = express();

mongoose.set('strictQuery', true);

// Function to create a default user on startup
const createDefaultUser = async () => {
  try {
    const defaultEmail = "aman@example.com";
    let user = await User.findOne({ email: defaultEmail });

    if (!user) {
      const defaultUser = new User({
        businessName: "Aman's Business",
        email: defaultEmail,
        password: "Aman" // The password will be automatically hashed
      });
      await defaultUser.save();
      console.log("✅ Default user 'Aman' created successfully!");
    } else {
      console.log("ℹ️ Default user 'Aman' already exists.");
    }
  } catch (error) {
    console.error("Error creating default user:", error);
  }
};

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected...');
    createDefaultUser();
  })
  .catch(err => console.error(err));

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/transactions', require('./routes/transactions')); 
app.use('/api/reports', require('./routes/reports'));  

// Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));