const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who created the subject
    categories: [{ type: String }], // Array of category strings
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);
