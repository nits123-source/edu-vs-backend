// routes/contact.js
const express = require('express');
const router = express.Router();
const { submitContactForm,getContacts } = require('../controllers/ContactUsController');

// POST route for form submission
router.post('/contact', submitContactForm);
router.get("/contact",getContacts)

module.exports = router;
