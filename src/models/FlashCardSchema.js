const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  interval: { type: Number, default: 1 }, // Days between reviews
  easeFactor: { type: Number, default: 2.5 }, // Initial ease factor
  reviewCount: { type: Number, default: 0 },
  nextReviewDate: { type: Date, default: Date.now },
  isPublic: { type: Boolean, default: false }, // Public/Private
  isApproved: { type: Boolean, default: false }, // Admin approval
  subject:{type:String,required:true},
  difficulty:{type:String,required:true},
},{ timestamps: true });

module.exports = mongoose.model('Flashcard', flashcardSchema);
