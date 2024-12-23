// SubjectController.js
const Subject = require('../models/SubjectSchema');

const SubjectController = {
  // Create a new subject
  async createSubject(req, res) {
    try {
      const { subjects} = req.body;
      const name=subjects[0].name;
      const description=subjects[0].description;
     
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

  // Create multiple subjects
  async createManySubjects(req, res) {
    try {
      const { subjects } = req.body; // Expect an array of subject objects
      
      if (!Array.isArray(subjects)) {
        return res.status(400).json({ error: 'Subjects must be provided as an array' });
      }

      const subjectsToCreate = subjects.map(subject => ({
        name: subject.name.toLowerCase(),
        description: subject.description,
        createdBy: req.user.userId
      }));

      const createdSubjects = await Subject.insertMany(subjectsToCreate);
      res.status(201).json({message:"Subjects created successfully",subjects:createdSubjects});
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