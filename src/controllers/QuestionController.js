const Question = require('../models/QuestionSchema');
const Subject = require('../models/SubjectSchema');

const QuestionController = {
  // Create a new question
  createQuestion: async (req, res) => {
    try {
      const { questionText, subjectName, options, difficulty } = req.body;

      // Validate input
      if (!questionText || !subjectName || !options || !Array.isArray(options) || options.length === 0) {
        return res.status(400).json({ error: 'Question text, subject name, and options are required.' });
      }

      // Check if the subject exists
      const subject = await Subject.findOne({ name: subjectName });
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      // Create and save the question
      const question = new Question({
        questionText,
        subjectId: subject._id,
        options,
        difficulty,
      });

      await question.save();
      res.status(201).json({ message: 'Question created successfully', question });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all questions
  getAllQuestions: async (req, res) => {
    try {
      const questions = await Question.find().populate('subjectId', 'name');
      res.status(200).json(questions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get questions by subject name
  getQuestionsBySubject: async (req, res) => {
    try {
      const { subjectName } = req.params;

      // Find the subject
      const subject = await Subject.findOne({ name: subjectName });
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      // Find questions for the subject
      const questions = await Question.find({ subjectId: subject._id });
      res.status(200).json(questions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete a question
  deleteQuestion: async (req, res) => {
    try {
      const { id } = req.params;

      const question = await Question.findByIdAndDelete(id);

      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      res.status(200).json({ message: 'Question deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update a question
  updateQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const { questionText, options, difficulty } = req.body;

      const question = await Question.findById(id);

      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      if (questionText) question.questionText = questionText;
      if (options) question.options = options;
      if (difficulty) question.difficulty = difficulty;

      await question.save();

      res.status(200).json({ message: 'Question updated successfully', question });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = QuestionController;
