const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 280 },
  image: { type: String }, 
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Status', StatusSchema, 'statuses');
