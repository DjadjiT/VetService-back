const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: parseInt(process.env.PORT),
    DB_URI: process.env.DB_URI,
    JWT_KEY: process.env.JWT_KEY,
    STRIPE_PUBLIC_API_KEY: process.env.STRIPE_PUBLIC_API_KEY,
    STRIPE_SECRET_API_KEY: process.env.STRIPE_SECRET_API_KEY,
    SUBSCRIPTION_KEY: process.env.SUBSCRIPTION_KEY
};
