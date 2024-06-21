const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

router.post('/submit', authenticateToken, async (req, res) => {
    const { match1, match2, match3, match4, match5 } = req.body;
    const username = req.user.username;
    try {
        const prediction = new Prediction({ username, match1, match2, match3, match4, match5 });
        await prediction.save();
        res.status(201).json({ message: 'Predictions submitted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const predictions = await Prediction.find({});
        res.json(predictions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
