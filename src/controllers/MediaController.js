
// ResourceController.js
const Resource = require('../models/MediaSchema');

const ResourceController = {
  // Add a resource
  async addResource(req, res) {
    try {
      const { subject, title, type, url, description } = req.body;
      const resource = await Resource.create({
        subject,
        title,
        type,
        url,
        description,
        uploadedBy: req.user.id,
      });
      res.status(201).json(resource);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get resources by subject
  async getResourcesBySubject(req, res) {
    try {
      const { subjectId } = req.params;
      const resources = await Resource.find({ subject: subjectId });
      res.status(200).json(resources);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = ResourceController;