const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
