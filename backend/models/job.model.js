const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  email: { type: Object, required: true }, // The email object to be sent
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

jobSchema.index({ status: 1 });

const Job = mongoose.model('Job', jobSchema);

module.exports = { Job };