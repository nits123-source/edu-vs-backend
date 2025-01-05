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
    bookmarks: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the bookmarked item
        itemType: { type: String, enum: ["question", "article", "video"], required: true }, // Type of the item
        title: { type: String }, // Title or description of the item
        url: { type: String }, // Link to the item (if applicable)
        date: { type: Date, default: Date.now }, // Date the item was bookmarked
      },
    ],
  });
  
  module.exports = mongoose.model('User', userSchema);
  