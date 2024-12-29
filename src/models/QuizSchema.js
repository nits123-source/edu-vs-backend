const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  examName: { 
    type: String, 
    required: true, 
    
  },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [
        {
          text: { type: String, required: true },
          isCorrect: { type: Boolean, default: false },
        }
      ],
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who created the quiz
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
