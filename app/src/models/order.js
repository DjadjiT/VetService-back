const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    csId: {
        type: String,
        required: true,
    },
    shippingMethod: {
        type: String,
        required: true,
    },
    requestDate: {
        type: Date,
        required: true
    },
    item: [
        {
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }
    ],
})




module.exports = mongoose.model("Order", orderSchema);
