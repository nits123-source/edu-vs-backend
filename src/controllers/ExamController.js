const Exam = require('../models/ExamSchema');

const ExamController = {
  // Create a new exam
  createExam: async (req, res) => {
    try {
      const { name, description, date, subjects } = req.body;

      // Validate input
      if (!name ||  !subjects || !Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ error: 'Name and subjects are required.' });
      }

      // Create the exam
      const exam = new Exam({ name, description, date, subjects });
      await exam.save();
      res.status(201).json({ message: 'Exam created successfully', exam });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all exams
  getAllExams: async (req, res) => {
    try {
      const exams = await Exam.find().populate('subjects.subjectId');
      res.status(200).json(exams);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get a specific exam by ID
  getExamById: async (req, res) => {
    try {
      const { id } = req.params;
      const exam = await Exam.findById(id).populate('subjects.subjectId');

      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      res.status(200).json(exam);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update an exam
  updateExam: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, date, subjects } = req.body;

      const exam = await Exam.findById(id);

      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      if (name) exam.name = name;
      if (description) exam.description = description;
      if (date) exam.date = date;
      if (subjects) exam.subjects = subjects;

      await exam.save();
      res.status(200).json({ message: 'Exam updated successfully', exam });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete an exam
  deleteExam: async (req, res) => {
    try {
      const { id } = req.params;

      const exam = await Exam.findByIdAndDelete(id);

      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      res.status(200).json({ message: 'Exam deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Add a quiz to a specific subject within an exam
  addQuizToExam: async (req, res) => {
    try {
      const { examId, subjectId } = req.params;
      const { questionText, options } = req.body;

      if (!questionText || !options || !Array.isArray(options) || options.length === 0) {
        return res.status(400).json({ error: 'Question text and options are required.' });
      }

      const exam = await Exam.findById(examId);

      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      const subject = exam.subjects.find((sub) => sub.subjectId.toString() === subjectId);

      if (!subject) {
        return res.status(404).json({ error: 'Subject not found in this exam' });
      }

      subject.questions.push({ questionText, options });
      await exam.save();

      res.status(200).json({ message: 'Quiz added to subject successfully', exam });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  // Get all questions for a specific exam and subject
  getQuestionsForSubject: async (req, res) => {
    try {
      const { examId, subjectId } = req.params;

      const exam = await Exam.findById(examId).populate('subjects.subjectId');

      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      const subject = exam.subjects.find((sub) => sub.subjectId.toString() === subjectId);

      if (!subject) {
        return res.status(404).json({ error: 'Subject not found in this exam' });
      }

      res.status(200).json({ questions: subject.questions });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = ExamController;
