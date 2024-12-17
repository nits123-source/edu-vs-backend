const mongoose=require("mongoose");
const examSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    date: { type: Date},
    subjects: [
      {
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
        questions: [
          {
            questionText: { type: String, required: true },
            options: [
              {
                text: { type: String, required: true },
                isCorrect: { type: Boolean, default: false },
              },
            ],
          },
        ],
      },
    ],
  });
  
  module.exports = mongoose.model('Exam', examSchema);
  