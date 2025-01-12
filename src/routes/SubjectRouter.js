const express=require("express");
const SubjectController = require("../controllers/SubjectController");
const authMiddleware = require("../middlewares/authMiddleware");
const subjectRouter = express.Router();
subjectRouter.post('/', authMiddleware, SubjectController.createSubject);
subjectRouter.get('/', SubjectController.getAllSubjects);
subjectRouter.post('/many', authMiddleware, SubjectController.createManySubjects);

module.exports=subjectRouter;