const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false }, // Mark the correct answer(s)
    },
  ],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }, // Optional difficulty level
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Question', questionSchema);
