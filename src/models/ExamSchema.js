const mongoose=require("mongoose");
const examSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    date: { type: Date},
   
  });
  
  module.exports = mongoose.model('Exam', examSchema);
  