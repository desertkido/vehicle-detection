const mongoose = require('mongoose');

exports.connect = () => {
    mongoose.connect('mongodb://mongodb:27017/imageDetectionDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('MongoDB connected'))
      .catch(err => console.error('MongoDB connection error:', err));
};
