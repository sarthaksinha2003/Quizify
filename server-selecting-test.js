const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5005;

const Test = require('./models/test');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/quizzify', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.get('/quizzify/tests', async (req, res) => {
    try {
        const tests = await Test.find();  
        res.json(tests);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tests' });
    }
});

app.get('/api/test-questions/:testId', async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.json(test.questions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching test questions' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
