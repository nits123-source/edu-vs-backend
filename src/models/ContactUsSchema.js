// models/Contact.js
const mongoose = require('mongoose');

// Define the schema for the contact form
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], // Valid email format
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically add timestamp when the form is submitted
  },
});

// Create the model for the Contact form
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
