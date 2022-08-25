const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 5,
        maxlength: 255,
    },
    birthdate: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
    },
    role: {
        type: String,
        required: true,
        default: "client"
    },
    active: {
        type: Boolean,
        default: false,
        required: true
    },
    verifiedAt: {
        type: Date,
    },
    phoneNb: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 12,
    },
    speciality: {
        type: String,
        maxlength: 255,
    },
    appointmentType: [{
        type: String,
        maxlength: 255,
    }],
    paymentMethod: [{
        type: String,
        maxlength: 255
    }],
    informations: {
        type: mongoose.Schema.Types.ObjectId,
    },
    institutionName: {
        type: String,
        maxlength: 255,
    },
    street: {
        type: String,
        maxlength: 255,
    },
    postalCode: {
        type: String,
        maxlength: 255,
    },
    city: {
        type: String,
        maxlength: 255,
    },
    country: {
        type: String,
        maxlength: 255,
    },
    rpps: {
        type: String,
        maxlength: 255,
    },
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        },
        _id: false,
    }]
})

userSchema.methods.generateAuthToken = async function(expirationTime) {
    const user = this;
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY, {expiresIn: expirationTime })
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

module.exports = mongoose.model("User", userSchema);
