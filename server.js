const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User'); 
const Question = require('./models/Question');
const Test = require('./models/test');

const app = express();
const JWT_SECRET = 'secret123';

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/quizzify', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ email: newUser.email }, JWT_SECRET);
        res.json({ status: 'ok', message: 'User registered successfully', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 'error', error: 'Invalid login credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: 'error', error: 'Invalid login credentials' });
        }

        const token = jwt.sign({ email: user.email }, JWT_SECRET);
        res.json({ status: 'ok', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: 'Login failed' });
    }
});

app.get('/api/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json({ status: 'ok', questions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: 'Failed to retrieve questions' });
    }
});
app.post('/api/create-test', async (req, res) => {
    const { testName, createdBy, category, difficulty, questions } = req.body;

    try {
        const newTest = new Test({
            testName,
            createdBy,
            category,
            difficulty,
            questions,
        });

        await newTest.save();
        res.status(201).json({ message: 'Test created successfully!' });
    } catch (err) {
        res.status(400).json({ message: 'Error creating test', error: err.message });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
