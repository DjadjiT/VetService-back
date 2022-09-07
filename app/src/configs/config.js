const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: parseInt(process.env.PORT),
    DB_URI: process.env.DB_URI,
    JWT_KEY: process.env.JWT_KEY
};
