const express = require('express');
const path = require('path');
const router = express.Router();
const Subscriber = require('../models/subscriberModel');

router.post('/', async (req, res) => {
    const { email } = req.body;

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).send(`
            <h1>Invalid email format</h1>
            <form action="/unsubscribe" method="post">
                <input type="email" name="email" placeholder="Enter your email" required>
                <button type="submit">Unsubscribe</button>
            </form>
            <a href="/">Go back</a>
        `);
    }

    try {
        // Check if the email is already subscribed
        const result = await Subscriber.deleteOne({ email });
        if (result.deletedCount === 0) {
            return res.status(409).send(`
                <h1>Email not found.</h1>
                <form action="/unsubscribe" method="post">
                    <input type="email" name="email" placeholder="Enter a different email" required>
                    <button type="submit">UnSubscribe</button>
                </form>
                <a href="/">Go back</a>
            `);
        } else {
            res.status(201).send(`
            <h1>Unsubscribed successfully!</h1>
            <a href="/">Go back</a>
        `);
        }
    }
    catch (error) {
        console.error('Unsubscription error:', error);
        res.status(500).send(`
            <h1>Internal server error</h1>
            <form action="/unsubscribe" method="post">
                <input type="email" name="email" placeholder="Enter your email" required>
                <button type="submit">Unsubscribe</button>
            </form>
            <a href="/">Go back</a>
        `);
    }
});

module.exports = router;