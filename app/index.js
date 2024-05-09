const express = require('express');
const db = require('./src/mongoDBService.js');
const messageQueue = require('./src/rabbitMQService.js')

async function main() {
    // Connect to the database
    db.connect();

    // Connect to the RabbitMQ message queue and store the channel
    const channel = await messageQueue.connectRabbitMQ();
    await messageQueue.startEmailNotificationConsumer(channel)

    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.get('/health', (req, res) => {
        // Simple health check logic
        const healthCheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now()
        };
        try {
            res.status(200).json(healthCheck);
        } catch (e) {
            healthCheck.message = e;
            res.status(503).json(healthCheck);
        }
    });

    // Load routes
    const mainRoutes = require('./routes/mainRoutes');
    app.use('/', mainRoutes);

    const detectRoutes = require('./routes/detectRoutes')(channel);
    app.use('/detect', detectRoutes);

    const subscribeRoutes = require('./routes/subscribeRoutes')(channel);
    app.use('/subscribe', subscribeRoutes);

    const subscribeFormRoutes = require('./routes/subscribeFormRoutes');
    app.use('/subscribe-form', subscribeFormRoutes);

    const unsubscribeFormRoutes = require('./routes/unsubscribeFormRoutes');
    app.use('/unsubscribe-form', unsubscribeFormRoutes);

    const unsubscribeRoutes = require('./routes/unsubscribeRoutes');
    app.use('/unsubscribe', unsubscribeRoutes);

    // Start the server
    app.listen(3000, () => {
        console.log(`Server is listening on port 3000`);
    });
}

// Execute the async main function
main().catch(err => {
    console.error('Error occurred:', err);
});
