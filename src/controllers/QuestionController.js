const QuestionSchema = require('../models/QuestionSchema');
const Exam = require('../models/ExamSchema'); // Import the Exam model
const SubjectSchema = require('../models/SubjectSchema');
const Subject =require("../models/SubjectSchema")

const QuestionController = {
  // Create a new question
  createQuestion: async (req, res) => {
    try {
      const { questions } = req.body;
      const { questionText, subjectName, examName, options, difficulty } = questions[0];

      // Convert input fields to lowercase
      const subjectNameLower = subjectName ? subjectName.toLowerCase() : null;
      const examNameLower = examName ? examName.toLowerCase() : null;

      // Validate input
      if (!questionText || !options || !Array.isArray(options) || options.length === 0) {
        return res.status(400).json({ error: 'Question text and options are required.' });
      }

      let subject = null;
      if (subjectNameLower) {
        // Check if the subject exists (case-insensitive)
        subject = await Subject.findOne({ name: subjectNameLower });
        if (!subject) {
          return res.status(404).json({ error: 'Subject not found' });
        }
      }

      let examId = null;
      if (examNameLower) {
        // Find the exam by name (case-insensitive)
        const exam = await Exam.findOne({ name: examNameLower });
        if (!exam) {
          return res.status(404).json({ error: 'Exam not found' });
        }
        examId = exam._id; // Extract the exam ID
      }

      // Create and save the question
      const question = new QuestionSchema({
        questionText,
        subjectId: subject ? subject._id : undefined,
        examId: examId || undefined,
        options,
        difficulty: difficulty || undefined,
      });

      await question.save();
      res.status(201).json({ message: 'Question created successfully', question });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  createManyQuestions: async (req, res) => {
    try {
      const { questions } = req.body;

      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: 'Questions array is required and cannot be empty.' });
      }

      const createdQuestions = [];
      const errors = [];

      for (const questionData of questions) {
        try {
          const { questionText, subjectName, examName, options, difficulty,fact,category } = questionData;

          // Validate required fields
          if (!questionText || !options || !Array.isArray(options) || options.length === 0) {
            errors.push({ error: 'Invalid question format', questionData });
            continue;
          }

          // Convert input fields to lowercase
          const subjectNameLower = subjectName ? subjectName.toLowerCase() : null;
          const examNameLower = examName ? examName.toLowerCase() : null;
          const difficultyLower=difficulty.toLowerCase();

          // Find subject
          let subject = null;
          if (subjectNameLower) {
            subject = await Subject.findOne({ name: subjectNameLower });
            if (!subject) {
              errors.push({ error: 'Subject not found', subjectName });
              continue;
            }
          }

          // Find exam
          let examId = null;
          if (examNameLower) {
            const exam = await Exam.findOne({ name: examNameLower });
            if (!exam) {
              errors.push({ error: 'Exam not found', examName });
              continue;
            }
            examId = exam._id;
          }

          // Create and save question
          const question = new QuestionSchema({
            questionText,
            subjectId: subject ? subject._id : undefined,
            examId: examId || undefined,
            options,
            difficulty: difficultyLower || undefined,
            fact:fact,
            category:category.toLowerCase(),
          });

          const savedQuestion = await question.save();
          createdQuestions.push(savedQuestion);
        } catch (err) {
          console.error('Error creating question:', err.message, questionData);
          errors.push({ error: 'Error creating question', questionData, details: err.message });
        }
      }

      if (createdQuestions.length === 0) {
        return res.status(400).json({ error: 'No questions were created', details: errors });
      }

      res.status(201).json({
        message: `${createdQuestions.length} questions created successfully`,
        createdQuestions,
        errors,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },





  // Get all questions
  getAllQuestions: async (req, res) => {
    try {
      const { page, limit, subjectName, category } = req.query;
  
      // Decode subjectName and category if provided
      const decodeSubjectName = subjectName ? decodeURIComponent(subjectName) : null;
      const decodeCategory = category ? decodeURIComponent(category) : null;
      console.log("subject and category", decodeSubjectName, decodeCategory);
  
      // Step 1: Build query object
      let query = {};
      if (decodeSubjectName) {
        const subject = await SubjectSchema.findOne({ name: decodeSubjectName });
        if (!subject) {
          return res.status(404).json({ error: 'Subject not found' });
        }
        query.subjectId = subject._id;
      }
  
      if (decodeCategory) {
        query.category = decodeCategory;
      }
  
      console.log("query", query);
  
      // Step 2: Handle pagination if both page and limit are provided
      if (page && limit) {
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
  
        // Fetch questions with pagination and populate related fields
        const questions = await QuestionSchema.find(query)
          .populate('subjectId', 'name')
          .populate('examId', 'name')
          .skip(skip)
          .limit(limitNum);
  
        // Get total count for pagination
        const total = await QuestionSchema.countDocuments(query);
  
        return res.status(200).json({
          questions,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
          },
        });
      }
  
      // Step 3: If no pagination parameters, fetch all questions
      const questions = await QuestionSchema.find(query)
        .populate('subjectId', 'name')
        .populate('examId', 'name');
  
      if (questions.length === 0) {
        return res.status(404).json({ error: 'Questions not found' });
      }
  
      return res.status(200).json({ questions });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  

   deleteQuestion : async (req, res) => {
    try {
      const { subjectName, category } = req.body;
  
      if (!subjectName) {
        return res.status(400).json({ message: 'Subject name is required.' });
      }
  
      // Find the subject by name
      console.log("subjectyName",subjectName)
      const subject = await SubjectSchema.findOne({ name: subjectName });
  
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found.' });
      }
  
      // Create the query object
      const query = { subjectId: subject._id };
      if (category) {
        query.category = category;
      }
  
      // Delete the question(s) based on the query
      const deletedQuestion = await QuestionSchema.deleteMany(query);
  
      if (deletedQuestion.deletedCount === 0) {
        return res.status(404).json({
          message: 'No questions found for the given subject and category.',
        });
      }
  
      res.status(200).json({
        message: `${deletedQuestion.deletedCount} question(s) deleted successfully.`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while deleting the question.', error: error.message });
    }
  },
  

  // Get questions by subject name
  getQuestionsBySubject: async (req, res) => {
    try {
      const { subjectName,category } = req.params;
      const decodeSubjectName=decodeURIComponent(subjectName);

      // Convert subject name to lowercase

      // Find the subject
      const subject = await Subject.findOne({ name: decodeSubjectName,category });
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      // Find questions for the subject
      const questions = await QuestionSchema.find({ subjectId: subject._id });
      res.status(200).json(questions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getQuestionsBySubjectAndCategory: async (req, res) => {
    try {
      const { subjectName, category } = req.params;
      const decodeSubjectName=decodeURIComponent(subjectName);
      const decodeCategory=decodeURIComponent(category);
  
      // Convert subject name to lowercase
      const subjectNameLower = decodeURIComponent(decodeSubjectName).toLowerCase();
  
      // Find the subject
      const subject = await Subject.findOne({ name: subjectNameLower });
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found from category' });
      }
  
      // Find questions based on subjectId and category
      const questions = await QuestionSchema.find({ 
        subjectId: subject._id,
        category: decodeCategory // Filter by category
      });
  
      // If no questions are found
      if (questions.length === 0) {
        return res.status(404).json({ error: 'No questions found for this subject and category' });
      }
  
      res.status(200).json(questions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  

  // Delete a question
  // deleteQuestion: async (req, res) => {
  //   try {
  //     const { id } = req.params;

  //     const question = await QuestionSchema.findByIdAndDelete(id);

  //     if (!question) {
  //       return res.status(404).json({ error: 'Question not found' });
  //     }

  //     res.status(200).json({ message: 'Question deleted successfully' });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // },

  // Update a question
  updateQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const { questionText, options, difficulty, subjectName, examName } = req.body;

      const question = await QuestionSchema.findById(id);

      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      if (questionText) question.questionText = questionText;
      if (options) question.options = options;
      if (difficulty) question.difficulty = difficulty;

      // Handle examName and subjectName
      if (examName) {
        const examNameLower = examName.toLowerCase();
        const exam = await Exam.findOne({ name: examNameLower });
        if (!exam) {
          return res.status(404).json({ error: 'Exam not found' });
        }
        question.examId = exam._id;
      }

      if (subjectName) {
        const subjectNameLower = subjectName.toLowerCase();
        const subject = await Subject.findOne({ name: subjectNameLower });
        if (!subject) {
          return res.status(404).json({ error: 'Subject not found' });
        }
        question.subjectId = subject._id;
      }

      await question.save();

      res.status(200).json({ message: 'Question updated successfully', question });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = QuestionController;
