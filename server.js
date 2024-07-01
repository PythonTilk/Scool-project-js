const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const predictionRoutes = require('./routes/predictions');
const path = require('path');

const app = express();

mongoose.connect('mongodb://localhost:27017/em-tipp-game', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionRoutes);

// Handle root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
