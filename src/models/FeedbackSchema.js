const mongoose = require('mongoose');

// Define Feedback schema
const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  feedbackType: {
    type: String,
    enum: ['Improvement', 'Bug', 'Feature Request'],
    required: true,
  },
}, {
  timestamps: true,  // Add createdAt and updatedAt fields
});

// Create Feedback model
const FeedbackSchema = mongoose.model('Feedback', feedbackSchema);

module.exports = FeedbackSchema;
