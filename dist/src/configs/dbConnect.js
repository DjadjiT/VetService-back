const mongoose = require('mongoose');
const { DB_URI } = require('./config');

const connectToMongoDB = async () => {
    try {
        mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (err) {
        console.error(err.message);
    }
};

module.exports = connectToMongoDB;
