const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
}, { timestamps: true });

const Email = mongoose.model('Email', emailSchema);

module.exports = { Email }