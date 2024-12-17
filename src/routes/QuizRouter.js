const express=require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const QuizController = require("../controllers/QuizController");
const quizRouter = express.Router();
quizRouter.post('/', authMiddleware, QuizController.createQuiz);
quizRouter.get('/:subjectId', QuizController.getQuizzesBySubject);

module.exports=quizRouter;