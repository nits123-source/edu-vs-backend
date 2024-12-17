const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who created the subject
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
