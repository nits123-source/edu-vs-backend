const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  type: { type: String, enum: ['youtube', 'pdf', 'image'], required: true },
  url: { type: String, required: true },
  title: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who uploaded the media
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
