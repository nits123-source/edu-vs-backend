const Feedback = require('../models/FeedbackSchema');

// Controller function to submit feedback (already provided earlier)
const submitFeedback = async (req, res) => {
  try {
    const { name, email, subject, message, feedbackType } = req.body;

    const feedback = new Feedback({
      name,
      email,
      subject,
      message,
      feedbackType,
    });

    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully!',
      feedback,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback. Please try again later.' });
  }
};

// Controller function to get feedbacks (already provided earlier)
const getFeedbacks = async (req, res) => {
  try {
    const { feedbackType } = req.query;
    const query = feedbackType ? { feedbackType } : {};
    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 });

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Error fetching feedbacks. Please try again later.' });
  }
};

// Controller function to delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the feedback by ID
    const feedback = await Feedback.findByIdAndDelete(id);

    // If no feedback is found, return an error
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Return a success message if the feedback was deleted
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Error deleting feedback. Please try again later.' });
  }
};

module.exports = {
  submitFeedback,
  getFeedbacks,
  deleteFeedback,  // Export the deleteFeedback function
};
