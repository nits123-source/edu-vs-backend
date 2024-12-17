const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const UserRouter = require('./routes/UserRouter');
const SubjectRouter=require("./routes/SubjectRouter");
const QuizRouter=require("./routes/QuizRouter");
const ResourceRouter=require("./routes/MediaRouter");
const ExamRouter=require("./routes/ExamRouter");
const QuestionRouter=require("./routes/QuestionRouter");
const tokenRouter = require('./routes/TokenRouter');
console.log("ExamRouter-------",ExamRouter);
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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});