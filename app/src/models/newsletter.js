const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    object: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
})




module.exports = mongoose.model("Newsletter", newsletterSchema);
