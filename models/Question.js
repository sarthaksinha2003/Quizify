const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: String,
    category: String,
    type: String,
    difficulty: String,
    options: [String],
    correctAnswer: String,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
