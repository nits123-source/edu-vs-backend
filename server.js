const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const UserRouter = require('./src/routes/UserRouter');
const SubjectRouter=require("./src/routes/SubjectRouter");
const QuizRouter=require("./src/routes/QuizRouter");
const ResourceRouter=require("./src/routes/MediaRouter");
const ExamRouter=require("./src/routes/ExamRouter");
const QuestionRouter=require("./src/routes/QuestionRouter");
const tokenRouter = require('./src/routes/TokenRouter');
const ContactUsRouter = require('./src/routes/ContactUsRouter')
require('dotenv').config();

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database Connection
connectDB();

// Basic route
app.use('/api/users', UserRouter);
app.use("/api/subject",SubjectRouter);
app.use("/api/quiz",QuizRouter);
app.use("/api/resource",ResourceRouter);
app.use("/api/exam",ExamRouter);
app.use("/api/question",QuestionRouter);
app.use('/api/token', tokenRouter);
app.use("/api",ContactUsRouter)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});