const express = require('express');
const path = require('path');
const router = express.Router();
const messageQueue = require('../src/rabbitMQService')
const Subscriber = require('../models/subscriberModel');



module.exports = (channel) => {
    router.post('/', async (req, res) => {
        const { email } = req.body;

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return res.sendFile(path.join(__dirname, '../views', 'invalidEmail.html'));
        }

        try {
            // Check for existing subscribers
            const exists = await Subscriber.findOne({ email });
            if (exists) {
                return res.sendFile(path.join(__dirname, '../views', 'alreadyEmail.html'));
            }

            // Save the new subscriber
            const subscriber = new Subscriber({ email });
            await subscriber.save();

            // Process with RabbitMQ channel
            await messageQueue.handleNewSubscription(email, channel);

            // Success response
            res.sendFile(path.join(__dirname, '../views', 'validEmail.html'));

        } catch (error) {
            console.error('Subscription error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};





