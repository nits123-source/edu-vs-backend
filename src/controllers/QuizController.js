// QuizController.js
const Quiz = require('../models/QuizSchema');
const SubjectSchema = require('../models/SubjectSchema');

const QuizController = {
  // Create a new quiz
  async createQuiz(req, res) {
    try {
      // Extract quizzes from the request body
      const { quizzes } = req.body; // Array of quizzes to create
  
      // Check if quizzes array exists and is not empty
      if (!Array.isArray(quizzes) || quizzes.length === 0) {
        return res.status(400).json({ error: 'No quizzes provided' });
      }
  
      const createdQuizzes = [];
      
      // Loop through each quiz and process it
      for (let quizData of quizzes) {
        const { examName, subjectName, questions } = quizData;
  
        // Find the subject based on the subjectName
        const subject = await SubjectSchema.findOne({ name: subjectName.toLowerCase() });
        if (!subject) {
          return res.status(404).json({ error: `Subject ${subjectName} not found` });
        }
  
        // Create the quiz
        const quiz = await Quiz.create({
          subject: subject._id,
          examName,
          title: examName, // Assuming the title is same as examName
          questions,
          createdBy: req.user.id,
        });
  
        // Add the created quiz to the result array
        createdQuizzes.push(quiz);
      }
  
      // Return all created quizzes
      res.status(201).json({ quizzes: createdQuizzes });
    } catch (err) {
      console.error(err);
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