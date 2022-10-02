const mongoose = require('mongoose');
const { DB_URI } = require('./config');

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB yay");
    } catch (err) {
        console.error(err.message);
    }
};

module.exports = connectToMongoDB;
