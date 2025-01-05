// routes/contact.js
const express = require('express');
const router = express.Router();
const { submitContactForm,getContacts, deleteContact } = require('../controllers/ContactUsController');

// POST route for form submission
router.post('/contact', submitContactForm);
router.get("/contact",getContacts)
router.delete("/contact/:id",deleteContact)

module.exports = router;
