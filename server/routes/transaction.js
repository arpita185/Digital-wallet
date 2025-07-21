// server/routes/transaction.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Transaction = require('../models/Transaction'); // ✅ Import the model

// ✅ POST /api/transaction/send
router.post('/send', authMiddleware, async (req, res) => {
  const { recipientEmail, amount } = req.body;
  const senderId = req.user.id;

  try {
    const sender = await User.findById(senderId);
    const recipient = await User.findOne({ email: recipientEmail });

    if (!recipient) return res.status(404).json({ message: "Recipient not found" });
    if (sender.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save();
    await recipient.save();

    await Transaction.create({
      sender: sender._id,
      recipient: recipient._id,
      amount
    });

    res.json({ message: `₹${amount} sent to ${recipient.email}` });
  } catch (err) {
    console.error('Send Error:', err.message);
    res.status(500).json({ message: "Transaction failed" });
  }
});

// ✅ Updated /api/transaction/history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
    .populate('sender', 'email')
    .populate('recipient', 'email')
    .sort({ createdAt: -1 }); // optional: latest first

    const formatted = transactions.map(txn => ({
      amount: txn.amount,
      senderEmail: txn.sender.email,
      recipientEmail: txn.recipient.email,
      type: txn.sender._id.toString() === userId ? 'sent' : 'received',
      date: txn.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    console.error('History Error:', err.message);
    res.status(500).json({ message: 'Failed to fetch transaction history' });
  }
});



module.exports = router;
