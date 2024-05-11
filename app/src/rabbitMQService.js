const amqp = require('amqplib');
const Subscriber = require('../models/subscriberModel');
const ImageModel = require('../models/imageModel');
const emailController = require('./emailController')



exports.connectRabbitMQ = async () => {
    const username = process.env.RABBITMQ_USER;
    const password = process.env.RABBITMQ_PW;
    try {
        const connection = await amqp.connect(`amqp://${username}:${password}t@rabbitmq:5672`);
        const channel = await connection.createChannel();
        await channel.assertQueue('notificationQueue', {
            durable: true
        });
        console.log("Connected to RabbitMQ and queue asserted");
        return channel;
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        return null;
    }
};

exports.startEmailNotificationConsumer = async (channel) => {
    console.log("Waiting for messages in notificationQueue...");

    channel.consume('notificationQueue', async function(msg) {
        console.log("Received a notification message:", msg.content.toString());
        const data = JSON.parse(msg.content);

        if (data.type === 'newImage') {
            // Notify all subscribers about the new image
            const imageInfo = [{
                description: data.description,
                vehicleCount: data.vehicleCount,
                date: data.date
            }];

            const subscribers = await Subscriber.find({});
            subscribers.forEach(sub => {
                emailController.sendImageDetails(sub.email, "New Image Uploaded", imageInfo);
            });

        } else if (data.type === 'newSubscription') {
            // Notify a specific subscriber about all existing images
            const email = data.email;
            const images = data.images;

            await emailController.sendImageDetails(email, "Welcome to Our Service! Here are the current images:", images);
        }

        channel.ack(msg);
    });
}

exports.handleNewSubscription = async (email, channel) => {
    const images = await ImageModel.find({}, 'boxes vehicleCount description _id date').lean();
    const imageMetadata = images.map(img => ({
        imageUrl: `/images/${img._id}`,
        description: img.description,
        vehicleCount: img.vehicleCount,
        date: img.date
    }));

    const message = JSON.stringify({
        email: email,
        type: 'newSubscription',
        images: imageMetadata
    });
    console.log(`Kuldom`);
    await channel.sendToQueue('notificationQueue', Buffer.from(message));
}
