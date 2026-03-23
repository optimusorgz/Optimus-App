const express = require('express');
const router = express.Router();

const users = [
    { id: 1, name: 'Test User', email: 'test@example.com', password: 'password123', role: 'buyer' }
];

// Register Route
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if user exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = { id: users.length + 1, name, email, password, role: 'buyer' };
    users.push(newUser);

    res.status(201).json({
        message: 'User registered successfully',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
});

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for user
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    // Validate password (plain text for now, will use bcrypt later)
    if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token: 'mock-jwt-token'
    });
});

module.exports = router;
