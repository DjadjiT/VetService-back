"use strict";
const express = require('express');
const connectToMongoDB = require("./configs/dbConnect");
const {PORT} = require("./configs/config");
const dotenv = require('dotenv');
const smtpService = require('./services/smtpService');

dotenv.config();

var cors = require('cors');

const app = express();
const port = PORT;

app.use(express.json({extended: false}));

app.use(cors());

app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Express Server');
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Access-Control-Allow-Headers, Accept, Authorization");
        next()
})

// Connection to MongoDB
connectToMongoDB();

app.use('/auth', require('./routes/authRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/health-record', require('./routes/healthRecordRoutes'));
app.use('/appointment', require('./routes/appointmentRoutes'));
app.use('/stripe', require('./routes/stripeRoutes'));
