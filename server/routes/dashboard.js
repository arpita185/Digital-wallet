// ✅ Backend: server/routes/dashboard.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// ✅ GET /api/dashboard/balance
router.get('/balance', authMiddleware, async (req, res) => {
  console.log('✅ Fetch balance request for user ID:', req.user.id);
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ balance: user.balance });
  } catch (err) {
    console.error('❌ Balance fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch balance' });
  }
});

// server/routes/dashboard.js
router.post('/add-money', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔥 Fix: Ensure both are numbers
    const currentBalance = parseFloat(user.balance || 0);
    const amountToAdd = parseFloat(amount);

    console.log(`Balance Before: ${currentBalance}, Amount to Add: ${amountToAdd}, New Balance: ${currentBalance + amountToAdd}`);


    user.balance = currentBalance + amountToAdd;
    await user.save();

    res.json({ message: `₹${amountToAdd} added to your wallet`, balance: user.balance });
  } catch (err) {
    console.error('Add Money Error:', err.message);
    res.status(500).json({ message: "Failed to add money" });
  }
});




module.exports = router;
