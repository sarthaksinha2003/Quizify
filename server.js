const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User'); // Ensure that User schema is properly defined

const app = express();
const JWT_SECRET = 'secret123'; // Store securely in an environment variable

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/quizzify', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Register route
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', error: 'Email already registered' });
        }

        // Hash the password and create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ email: newUser.email }, JWT_SECRET);
        res.json({ status: 'ok', message: 'User registered successfully', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: 'Registration failed' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 'error', error: 'Invalid login credentials' });
        }

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: 'error', error: 'Invalid login credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ email: user.email }, JWT_SECRET);
        res.json({ status: 'ok', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', error: 'Login failed' });
    }
});

// Start server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
