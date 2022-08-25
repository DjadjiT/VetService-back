const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    startingHour: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 5,
        trim: true,
    },
    pauseStart: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 5,
        trim: true,
    },
    pauseFinish: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 5,
        trim: true,
    },
    finishingHour: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 5,
        trim: true,
    },
    workingDay: {
        bsonType: ["array"],
        items : { bsonType: ["boolean"] },
        minItems: 7,
        maxItems: 7,
        description: "must be a array of 7 element"
    },
})
