const Exam = require('../models/ExamSchema');

const ExamController = {
  // Create a new exam
  createExam: async (req, res) => {
    try {
      const { name, description, date } = req.body;

      // Validate that name is required
      if (!name) {
        return res.status(400).json({ error: 'Name is required.' });
      }

      // Convert name to lowercase before saving
      const exam = new Exam({ name: name.toLowerCase(), description, date });
      await exam.save();
      res.status(201).json({ message: 'Exam created successfully', exam });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create multiple exams
  createManyExams: async (req, res) => {
    try {
      const { exams } = req.body;

      // Validate that examsData is an array and not empty
      if (!Array.isArray(exams) || exams.length === 0) {
        return res.status(400).json({ error: 'You must provide an array of exams.' });
      }

      // Validate that each exam has a required name and convert name to lowercase
      const formattedExams = exams.map(exam => {
        if (!exam.name) {
          throw new Error('Each exam must have a name.');
        }
        return { ...exam, name: exam.name.toLowerCase() };
      });

      // Create multiple exams
      const examsData = await Exam.insertMany(formattedExams);
      res.status(201).json({ message: 'Exams created successfully', exams: examsData });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all exams
  getAllExams: async (req, res) => {
    try {
      const exams = await Exam.find();
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
      const exam = await Exam.findById(id);

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
      const { name, description, date } = req.body;

      const exam = await Exam.findById(id);

      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      // Update fields, converting name to lowercase if provided
      if (name) exam.name = name.toLowerCase();
      if (description) exam.description = description;
      if (date) exam.date = date;

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
};

module.exports = ExamController;
