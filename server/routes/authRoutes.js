const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existUser = await User.findOne({ email });
    if (!existUser) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, existUser.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', user: existUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
