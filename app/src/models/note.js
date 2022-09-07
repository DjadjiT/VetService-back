const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    informations: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 12,
    },
    date: {
        type: Date,
        required: true,
    },
})




module.exports = mongoose.model("Note", noteSchema);
