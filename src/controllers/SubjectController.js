const Subject = require('../models/SubjectSchema');

const SubjectController = {
  // Create a new subject
  async createSubject(req, res) {
    try {
      const { subjects } = req.body;

      if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ error: 'Subjects array is required' });
      }

      const { name, categories } = subjects[0];

      // Ensure categories are properly converted to lowercase
      const updatedCategories = categories.map((category) => category.toLowerCase());

      if (!name || !categories || !Array.isArray(categories) || categories.length === 0) {
        return res.status(400).json({ error: 'Both name and categories are required and categories must be an array with at least one value' });
      }

      // Check if subject with the same name already exists
      const existingSubject = await Subject.findOne({ name: name.toLowerCase() });

      if (existingSubject) {
        return res.status(400).json({ error: 'Subject already exists' });
      }

      // Create new subject
      const subject = await Subject.create({
        name: name.toLowerCase(),
        categories: updatedCategories,
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
  
      if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ error: 'Subjects array is required' });
      }
  
      // Validate the subjects

      const invalidSubjects = subjects.filter(
        (subject) => !subject.name || !subject.category || !Array.isArray(subject.category) || subject.category.length === 0
      );
  
      if (invalidSubjects.length > 0) {
        return res.status(400).json({
          error: 'Each subject must have a name and categories must be an array with at least one value',
          invalidSubjects,
        });
      }
  
      // Normalize subject names and categories to lower case for consistency
      console.log("subjects---------",subjects);
      const normalizedSubjects = subjects.map((subject) => ({
        name: subject.name.toLowerCase(),
        categories: subject.category.map((category) => category.toLowerCase()),
      }));
  
      // Check for duplicates
      // const existingSubjects = await Subject.find({
      //   name: { $in: normalizedSubjects.map(subject => subject.name) }
      // });
  
      // const existingSubjectNames = existingSubjects.map(subject => subject.name);
      // const subjectsToCreate = normalizedSubjects.filter(
      //   (subject) => !existingSubjectNames.includes(subject.name)
      // );
  
      // if (subjectsToCreate.length === 0) {
      //   return res.status(400).json({
      //     error: 'All provided subjects already exist.',
      //     existingSubjects: existingSubjectNames,
      //   });
      // }
  
      // Proceed with creating only non-existing subjects
      const subjectsToInsert = normalizedSubjects.map((subject) => ({
        ...subject,
        createdBy: req.user.userId,  // Adding user ID who created the subject
      }));
  
      const createdSubjects = await Subject.insertMany(subjectsToInsert);
  
      // Prepare response
      const createdSubjectNames = createdSubjects.map(subject => subject.name);
  
      res.status(201).json({
        message: 'Subjects created successfully',
        createdSubjects: createdSubjectNames,
        // skippedSubjects: existingSubjectNames,
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  

  // Get all subjects
  async getAllSubjects(req, res) {
    console.log("called get bsubject")
    try {
      const subjects = await Subject.find();
      res.status(200).json(subjects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = SubjectController;
