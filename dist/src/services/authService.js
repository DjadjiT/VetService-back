const {check} = require("express-validator");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {ROLE} = require("../models/role")
const {ValidationError, UserDoesntExistError, AuthError, UserError} = require("../configs/customError")


exports.clientRegisterValidation = [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("birthdate", "Birthdate is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    check("phoneNb", "Phone number is required").not().isEmpty(),
];

exports.vetRegisterValidation = [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("birthdate", "Birthdate is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    check("phoneNb", "Phone number is required").not().isEmpty(),
    check("role", "Role is required").not().isEmpty(),
    check("speciality", "Speciality is required").not().isEmpty(),
    check("appointmentType", "appointmentType is required").not().isEmpty(),
    check("paymentMethod", "paymentMethod is required").not().isEmpty(),
    check("institutionName", "Institution name is required").not().isEmpty(),
    check("street", "street is required").not().isEmpty(),
    check("postalCode", "postalCode is required").not().isEmpty(),
    check("city", "city is required").not().isEmpty(),
    check("country", "Country is required").not().isEmpty(),
    check("rpps", "rpps is required").not().isEmpty(),
];

exports.loginValidation = [
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
];


function valideEmail(email) {
    return validator.isEmail(email);
}

exports.registerClient= async(user) => {
    console.log(user)
    if (!user.firstName || user.firstName.toString() === "") throw new ValidationError("First name is required.")
    if (!user.lastName || user.lastName.toString() === "") throw new ValidationError("Last name is required.")
    if (!user.email || user.email.toString() === "") throw new ValidationError("Email is required.")
    if (!user.birthdate || user.birthdate.toString() === "") throw new ValidationError("Birthdate is required.")
    if (!user.password || user.password.toString() === "") throw new ValidationError("Password is required.")
    if (!user.phoneNb || user.phoneNb.toString() === "") throw new ValidationError("Phone number is required.")

    if (!valideEmail(user.email)) throw new ValidationError("Email address is not valide.")

    let us = await User.findOne({ email: user.email.toLowerCase() });
    if (us) throw new AuthError("Email is already use")

    let newUser = new User({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email.toLowerCase(),
        birthdate: user.birthdate,
        role: ROLE.client,
        phoneNb: user.phoneNb,
        //TODO pour le moment on laisse, quand mail de vérif on avisera
        active: true
    })

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(user.password, salt);

    const tokenExpiresTime = 60*60*48;
    return newUser.generateAuthToken(tokenExpiresTime);
}

exports.registerVet= async(user) => {

}

exports.loginUser = async (email, password) => {
    if (!password || password.toString() === "") throw new ValidationError("Password is required.")
    if (!email || email.toString() === "") throw new ValidationError("Email is required.")

    if (!valideEmail(email)) throw new AuthError("Email address is not valid.")

    let user = await User.findOne({email: email});
    if (!user) throw new UserDoesntExistError()

    let passwordVerification = await bcrypt.compare(password, user.password);
    if(!passwordVerification) throw new UserError("Invalid credentials")

    if(user && !user.verified) throw new AuthError("Your account is not verify yet.")

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
