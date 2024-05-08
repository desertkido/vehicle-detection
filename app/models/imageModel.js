const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number,
    label: String,
    probability: Number
});

const imageSchema = new mongoose.Schema({
    image: Buffer,
    boxes: [boxSchema],
    vehicleCount: Number,
    description: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);