const {check} = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {ROLE, PAYMENTMETHOD, SPECIALITY} = require("../models/enum/enum")
const {ValidationError, UserDoesntExistError, AuthError, UserError} = require("../configs/customError")


exports.clientRegisterValidation = [
    check("firstName", "First name is required").not().isEmpty(),
    check("firstName", "First name is not long enough").isLength({min: 5, max: 255}),
    check("lastName", "Last name is required").not().isEmpty(),
    check("lastName", "Last name is not long enough").isLength({min: 5, max: 255}),
    check("email", "Email is required").not().isEmpty(),
    check("email", "Email is not an email type").isEmail(),
    check("birthdate", "Birthdate is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    check("password", "Password is not long enough").isLength({min: 5, max: 255}),
    check("phoneNb", "Phone number is required").not().isEmpty(),
    check("phoneNb", "Phone number is not numeric").isNumeric(),
];

exports.vetRegisterValidation = [
    check("role", "Role is required").not().isEmpty(),
    check("role", "Role doesnt exist").custom((value => {
        const roles = Object.keys(ROLE)
        for(const r of roles){
            if(r === value){
                return true
            }
        }
        return false
    })),
    check("speciality", "Speciality is required").not().isEmpty(),
    check("appointmentType", "AppointmentType is required").not().isEmpty(),
    check("paymentMethod", "PaymentMethod is required").not().isEmpty(),
    check("institutionName", "Institution name is required").not().isEmpty(),
    check("street", "Street is required").not().isEmpty(),
    check("postalCode", "PostalCode is required").not().isEmpty(),
    check("city", "City is required").not().isEmpty(),
    check("country", "Country is required").not().isEmpty(),
    check("rpps", "rpps is required").not().isEmpty(),
    check("rpps", "rpps is not alphanumeric").isAlphanumeric(),
];

exports.loginValidation = [
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
];


exports.registerNewUser = async(user) => {
    let us = await User.findOne({ email: user.email.toLowerCase() });
    if (us) throw new AuthError("Email is already use")

    let newUser = new User({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email.toLowerCase(),
        birthdate: user.birthdate,
        role: ROLE.client,
        phoneNb: user.phoneNb,
        healthRecords: [],
        //TODO pour le moment on laisse, quand mail de vérif on avisera
        active: true
    })

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(user.password, salt);

    const tokenExpiresTime = 60*60*48;
    return newUser.generateAuthToken(tokenExpiresTime);
}

exports.registerNewAdmin = async(user) => {
    let us = await User.findOne({ email: user.email.toLowerCase() });
    if (us) throw new AuthError("Email is already use")

    let newUser = new User({
        email: user.email.toLowerCase(),
        role: ROLE.admin,
        active: true
    })

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(user.password, salt);

    const tokenExpiresTime = 60*60*48;
    return newUser.generateAuthToken(tokenExpiresTime);
}

exports.registerNewVet = async(user) => {
    let us = await User.findOne({ email: user.email.toLowerCase() });

    let speciality = validateSpeciality(user.speciality)
    let pm = validatePaymentMethod(user.paymentMethod)

    if (us) throw new AuthError("Email is already use")
    let newVet = new User({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email.toLowerCase(),
        birthdate: user.birthdate,
        role: ROLE.veterinary,
        phoneNb: user.phoneNb,
        //TODO pour le moment on laisse, quand mail de vérif on avisera
        speciality: speciality.toLowerCase(),
        appointmentType: user.appointmentType,
        paymentMethod: pm,
        informations: user.informations,
        institutionName: user.institutionName,
        street: user.street.toLowerCase(),
        postalCode: user.postalCode.toLowerCase(),
        city: user.city.toLowerCase(),
        country: user.country.toLowerCase(),
        rpps: user.rpps,

    })

    const salt = await bcrypt.genSalt(10);
    newVet.password = await bcrypt.hash(user.password, salt);

    const tokenExpiresTime = 60*60*48;
    return newVet.generateAuthToken(tokenExpiresTime);
}

exports.verifyUser = async(userId) => {
    let user = await User.findOne({ _id: userId });
    if(!user) throw new UserDoesntExistError()


    return User.updateOne({_id: userId},
        {
            active: true,
            verifiedAt: new Date()
        })
}

exports.deverifyUser = async(userId) => {
    let user = await User.findOne({ _id: userId });
    if(!user) throw new UserDoesntExistError()


    return User.updateOne({_id: userId},
        {
            active: false,
        })
}

exports.loginUser = async (email, password) => {
    if (!password || password.toString() === "") throw new ValidationError("Password is required.")
    if (!email || email.toString() === "") throw new ValidationError("Email is required.")

    let user = await User.findOne({email: email});
    if (!user) throw new UserDoesntExistError()

    let passwordVerification = await bcrypt.compare(password, user.password);
    if(!passwordVerification) throw new UserError("Invalid credentials")

    if(user && !user.active) throw new AuthError("Your account is not verify yet.")

    const tokenExpiresTime = 60*60*72;
    const token = user.generateAuthToken(tokenExpiresTime);
    return token.then(async(token) => {
        const result = await new Promise((resolve, reject) => {
            resolve(token);
        });
        return result;
    }).catch((e) => {
        throw e
    });
}

exports.authUser = async(req, res, next) => {
    try {
        const authorization = req.header("Authorization");

        const jwtData = await getTokenInfo(authorization)
        if (!jwtData) return res.status(401).json("Unauthorized");
        req.userId = jwtData._id;

        let user = await User.findOne({_id: jwtData._id});
        if (!user) return res.status(404).json("User doesnt exist");


        next();
    } catch (err) {
        return res.status(401).json("Unauthorized");
    }
}

exports.authAdmin = async(req, res, next) => {
    try {

        let user = await User.findById(req.userId)
        if (!user) return res.status(404).json(error("User not found.", res.statusCode));

        if (user.role.toString() !== ROLE.admin) return res.status(401).json(error("Unauthorized", res.statusCode))


        next();
    } catch (err) {
        return res.status(401).json("Unauthorized");
    }
}

exports.authVet = async(req, res, next) => {
    try {

        let user = await User.findById(req.userId)
        if (!user) return res.status(404).json(error("User not found.", res.statusCode));

        if (user.role.toString() !== ROLE.veterinary) return res.status(401).json(error("Unauthorized", res.statusCode))


        next();
    } catch (err) {
        return res.status(401).json("Unauthorized");
    }
}

async function getTokenInfo(authorization){
    const splitAuthorizationHeader = authorization.toString().split(" ");

    const bearer = splitAuthorizationHeader[0];
    const token = splitAuthorizationHeader[1];

    if (bearer.toString() !== "Bearer") throw new AuthError("The token type must be a bearer");

    if (!token) throw new AuthError("No token found.");

    return jwt.verify(token, process.env.JWT_KEY);
}

function validatePaymentMethod(paymentMethods){
    let pmList = []
    for(const pm of paymentMethods){
        pmList.push(validatePM(pm))
    }
    return pmList
}

function validatePM(paymentMethod){
    for(const p of Object.values(PAYMENTMETHOD)){
        if(p.toLowerCase() === paymentMethod.toLowerCase()){
            return p
        }
    }
    throw new ValidationError("Payment methods doesn't exist.");
}

function validateSpeciality(speciality){
    for(const s of Object.values(SPECIALITY)){
        if(s.toLowerCase() === speciality.toLowerCase()){
            return s
        }
    }
    throw new ValidationError("Speciality doesn't exist.");
}
