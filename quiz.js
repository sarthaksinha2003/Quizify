const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

const Question = require('./models/Question');
const User = require('./models/User'); 

app.use(express.json());  
app.use(cors()); 

mongoose.connect('mongodb://localhost:27017/quizzify', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.get('/get-questions', async (req, res) => {
    const { num, level, type, category } = req.query;

    console.log("Received request:", req.query);

    try {
        const query = {};

        if (level && level !== 'all') {
            query.difficulty = { $regex: new RegExp(`^${level}$`, 'i') }; 
        }

        if (type && type !== 'all') {
            query.type = { $regex: new RegExp(`^${type}$`, 'i') };
        }

        if (category && category !== 'all') {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        console.log("Constructed Query:", query);

        const questions = await Question.find(query).limit(Number(num));

        console.log("Found Questions:", questions);

        if (questions.length === 0) {
            return res.status(404).json({ message: 'No questions found for the selected criteria' });
        }

        res.json(questions);
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await User.find().sort({ score: -1 }).limit(10);
        res.json(leaderboard);
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
