const express = require('express');
const QuestionController = require('../controllers/QuestionController');
const authMiddleware = require('../middlewares/authMiddleware');

const questionRouter = express.Router();

// Route to create a new question
questionRouter.post('/', authMiddleware, QuestionController.createQuestion);

questionRouter.post("/many",authMiddleware,QuestionController.createManyQuestions)

// Route to get all questions
questionRouter.get('/', authMiddleware, QuestionController.getAllQuestions);

// Route to get questions by subject name

questionRouter.get('/:subjectName', authMiddleware, QuestionController.getQuestionsBySubject);

// Route to update a question
questionRouter.put('/:id', authMiddleware, QuestionController.updateQuestion);

// Route to delete a question
questionRouter.delete('/:id', authMiddleware, QuestionController.deleteQuestion);

module.exports = questionRouter;
