// routes/contact.js
const express = require('express');
const { addQuestionToBookmark, fetchBookmark, removeFromBookmark } = require('../controllers/BookmarkController');
const router = express.Router();

// POST route for form submission
router.post('/', addQuestionToBookmark);
router.get('/',fetchBookmark);
router.delete("/:itemId",removeFromBookmark)

module.exports = router;
