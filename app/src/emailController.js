const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vaczi.otti@gmail.com',
        pass: 'ourf fywp ntqa ancx'
    }
});

sendEmail = async (to, subject, text) => {
    let mailOptions = {
        from: 'vaczi.otti@gmail.com',
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
