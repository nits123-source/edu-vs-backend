const express = require('express');
const ExamController = require('../controllers/ExamController');
const authMiddleware = require('../middlewares/authMiddleware');

const examRouter = express.Router();

// Create a new exam
examRouter.post('/', authMiddleware, ExamController.createExam);

examRouter.post("/many",authMiddleware,ExamController.createManyExams)

// Get all exams
examRouter.get('/', authMiddleware, ExamController.getAllExams);

// Get a specific exam by ID
examRouter.get('/:id', authMiddleware, ExamController.getExamById);

// Update an exam
examRouter.put('/:id', authMiddleware, ExamController.updateExam);

// Delete an exam
examRouter.delete('/:id', authMiddleware, ExamController.deleteExam);



module.exports=examRouter;