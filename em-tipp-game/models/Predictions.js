const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    username: { type: String, required: true },
    match1: String,
    match2: String,
    match3: String,
    match4: String,
    match5: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
