const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const detectionService = require('../src/detectionService');


const upload = multer(); // Configuring multer

module.exports = (channel) => {
    router.post('/', upload.single('image_file'), async (req, res) => {
        try {
            const description = req.body.description || "";
            const boxes = await detectionService.detectObjectsAndSaveImage(req.file.buffer, description, channel);
            res.json(boxes);
        } catch (error) {
            console.error('Error during detection:', error);
            res.status(500).json({ error: 'Failed to process image' });
        }
    });

    return router;
};