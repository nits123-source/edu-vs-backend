const express = require('express');
const ExamController = require('../controllers/ExamController');
const authMiddleware = require('../middlewares/authMiddleware');

const examRouter = express.Router();

// Create a new exam
examRouter.post('/', authMiddleware, ExamController.createExam);

// Get all exams
examRouter.get('/', authMiddleware, ExamController.getAllExams);

// Get a specific exam by ID
examRouter.get('/:id', authMiddleware, ExamController.getExamById);

// Update an exam
examRouter.put('/:id', authMiddleware, ExamController.updateExam);

// Delete an exam
examRouter.delete('/:id', authMiddleware, ExamController.deleteExam);

// Add a quiz to a specific subject within an exam
examRouter.post('/:examId/:subjectId/quiz', authMiddleware, ExamController.addQuizToExam);

// Get all questions for a specific exam and subject
examRouter.get('/:examId/:subjectId/questions', authMiddleware, ExamController.getQuestionsForSubject);

module.exports=examRouter;