const Contact = require('../models/ContactUsSchema'); // Import the Contact model

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Create a new contact form submission
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    // Save the submission to the database
    await newContact.save();

    // Respond with a success message
    res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};

exports.getContacts = async (req, res) => {
    try {
      // Fetch all contact submissions from the database
      const contacts = await Contact.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order
  
      // Respond with the list of contact submissions
      res.status(200).json(contacts);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
  };