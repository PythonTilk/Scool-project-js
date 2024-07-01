const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const apiUrl = 'https://api.openligadb.de/getmatchdata/em2024';

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
    const { predictions } = req.body;
    const username = req.user.username;
    try {
        const prediction = new Prediction({ username, predictions });
        await prediction.save();
        res.status(201).json({ message: 'Predictions submitted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const results = await fetchMatchResults();
        const predictions = await Prediction.find({});
        const leaderboard = predictions.map(pred => ({
            username: pred.username,
            score: calculateScore(pred.predictions, results)
        }));
        res.json(leaderboard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const fetchMatchResults = async () => {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const results = data.map(match => ({
            matchId: match.MatchID,
            team1: match.Team1.TeamId,
            team2: match.Team2.TeamId,
            score1: match.MatchResults[0]?.PointsTeam1,
            score2: match.MatchResults[0]?.PointsTeam2
        }));
        return results;
    } catch (error) {
        console.error('Error fetching match results:', error);
        return [];
    }
};

const calculateScore = (predictions, results) => {
    let score = 0;
    predictions.forEach(pred => {
        const result = results.find(res => res.matchId === pred.matchId);
        if (result && pred.score1 == result.score1 && pred.score2 == result.score2) {
            score += 5;
        }
    });
    return score;
};

module.exports = router;
