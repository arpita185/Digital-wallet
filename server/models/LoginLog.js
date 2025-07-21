// server/models/LoginLog.js
const mongoose = require('mongoose');

const LoginLogSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  time: { type: Date, default: Date.now },
  ip: String,
  userAgent: String
});

module.exports = mongoose.model('LoginLog', LoginLogSchema);
