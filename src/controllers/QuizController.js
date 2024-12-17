// QuizController.js
const Quiz = require('../models/QuizSchema');
const SubjectSchema = require('../models/SubjectSchema');

const QuizController = {
  // Create a new quiz
  async createQuiz(req, res) {
    try {
      const { subjectName, title, questions } = req.body;

      const subject = await SubjectSchema.findOne({ name: subjectName.toLowerCase() });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Create the quiz
    
      const quiz = await Quiz.create({
        subject:subject._id,
        title,
        questions,
        createdBy: req.user.id,
      });
      res.status(201).json(quiz);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get quizzes by subject
  async getQuizzesBySubject(req, res) {
    try {
      const { subjectId } = req.params;
      const quizzes = await Quiz.find({ subject: subjectId });
      res.status(200).json(quizzes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = QuizController;