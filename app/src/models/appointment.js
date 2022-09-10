const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    client: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    veterinary: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointmentType: {
        type: String,
        required: true
    },
    requestDate: {
        type: Date,
        required: true,
    },
    healthRecord: {
        type: mongoose.Types.ObjectId,
        ref: 'HealthRecord',
        required: true,
    },
    appointementDuration: {
        type: Number,
        required: true,
    }
})


module.exports = mongoose.model("Appointment", appointmentSchema);
