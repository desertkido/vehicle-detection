const nodemailer = require('nodemailer');

const email = process.env.EMAIL;
const emailPass = process.env.EMAIL_PASS;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: emailPass
    }
});

sendEmail = async (to, subject, text) => {
    let mailOptions = {
        from: email,
        to: to,
        subject: subject,
        text: text
    };
    
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email send error: ', error);
    }
};

exports.sendImageDetails = async (email, subject, images) => {
    const imageDetails = images.map(img => {
        return `Description: ${img.description}\nVehicle Count: ${img.vehicleCount}\nUploaded: ${img.date}\n\n`;
    }).join("");

    await sendEmail(email, subject, imageDetails);
};
