const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    contact: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: function (value) {
          // Validate as either email or phone number
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format for phone numbers
          return emailRegex.test(value) || phoneRegex.test(value);
        },
        message: 'Contact must be a valid email or phone number',
      },
    },
    password: { type: String, required: true },
    refreshToken: { type: String } ,
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  });
  
  module.exports = mongoose.model('User', userSchema);
  