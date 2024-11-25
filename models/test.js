const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: String,
    category: String,
    difficulty: String,
    type: String,
    options: [String],
    correctAnswer: String,
});

const testSchema = new mongoose.Schema({
    testName: String,
    createdBy: String,
    category: String,
    difficulty: String,
    questions: [questionSchema]
});

const Test = mongoose.model('Test', testSchema);
module.exports = Test;
