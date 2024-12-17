// SubjectController.js
const Subject = require('../models/SubjectSchema');

const SubjectController = {
  // Create a new subject
  async createSubject(req, res) {
    try {
      const { name, description } = req.body;
      console.log("req.user",req.user);
      console.log("req.body",req.body);
      const subject = await Subject.create({
        name:name.toLowerCase(),
        description,
        createdBy: req.user.userId, // Extracted from middleware
      });
      res.status(201).json(subject);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get all subjects
  async getAllSubjects(req, res) {
    try {
      const subjects = await Subject.find();
      res.status(200).json(subjects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = SubjectController;