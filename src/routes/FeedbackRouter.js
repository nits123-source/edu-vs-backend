// routes/contact.js
const express = require('express');
const { submitFeedback, getFeedbacks, deleteFeedback } = require('../controllers/FeedbackController');
const router = express.Router();

// POST route for form submission
router.post('/', submitFeedback);
router.get('/',getFeedbacks);
router.delete("/:id",deleteFeedback);

module.exports = router;
