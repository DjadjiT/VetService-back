const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 255,
        trim: true,
    },
    lastName: {
        type: String,
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
        type: String
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
    customerId: {
        type: String,
    },
    subscriptionList: {
        type: [{
            type: String,
        }],
        default: []
    },
    schedule: {
        startingHour: {
            type: String,
            minlength: 2,
            maxlength: 5,
            trim: true,
        },
        pauseStart: {
            type: String,
            minlength: 2,
            maxlength: 5,
            trim: true,
        },
        pauseFinish: {
            type: String,
            minlength: 2,
            maxlength: 5,
            trim: true,
        },
        finishingHour: {
            type: String,
            minlength: 2,
            maxlength: 5,
            trim: true,
        },
        workingDay: {
            type: [Boolean],
        },
    },
    healthRecords: [
        {
            type: mongoose.Types.ObjectId,
            ref: "HealthRecord"
        }
    ]
})

userSchema.methods.generateAuthToken = async function(expirationTime) {
    const user = this;
    const token = jwt.sign({_id: user._id, email: user.email}, process.env.JWT_KEY, {expiresIn: expirationTime })
    await user.save()
    return token
}

module.exports = mongoose.model("User", userSchema);
