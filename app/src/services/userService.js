const User = require("../models/user");
const {check} = require("express-validator");
const bcrypt = require("bcryptjs");
const {UserDoesntExistError, UserError, ValidationError} = require("../configs/customError")
const {ROLE, SPECIALITY, PAYMENTMETHOD} = require("../models/enum/enum")

exports.scheduleVerification = [
    check("startingHour", "startingHour is required").not().isEmpty(),
    check("pauseStart", "pauseStart is required").not().isEmpty(),
    check("pauseFinish", "pauseFinish is required").not().isEmpty(),
    check("finishingHour", "finishingHour is required").not().isEmpty(),
    check("workingDay", "workingDay is not correct").isArray()
];

exports.getCurrent = async (userId) =>{
    let user = await User.findOne({_id: userId});
    if (!user) throw new UserDoesntExistError()
    return user
}

exports.updateCurrent = async (user, id) => {
    let nUser = null
    let userDb = await User.findOne({_id: id});
    if(userDb.role === ROLE.veterinary){
        nUser = newVet(user, id)
        return User.findOneAndUpdate(nUser)
    }
    else if(userDb.role === ROLE.client || userDb.role === ROLE.admin){
        nUser = newUser(user, id)
        return User.findOneAndUpdate(nUser)

    }
    throw new UserError("Role doesn't exist.")
}

exports.deleteCurrent = async (id) => {
    return User.deleteOne({_id: id})
}

exports.updateVetSchedule = async (userId, schedule) => {
    if(schedule.workingDay.length !== 7) throw new ValidationError("The working day list is not good!");

    if(!validateScheduleHour(schedule.startingHour)) throw new ValidationError("The starting hour is not numeric!");
    if(!validateScheduleHour(schedule.pauseStart)) throw new ValidationError("The pause start hour is not numeric!");
    if(!validateScheduleHour(schedule.pauseFinish)) throw new ValidationError("The pause finish hour is not numeric!");
    if(!validateScheduleHour(schedule.finishingHour)) throw new ValidationError("The finishing hour hour is not numeric!");

    return User.updateOne({_id: userId},
        {
            schedule: {
                startingHour: schedule.startingHour,
                pauseStart: schedule.pauseStart,
                pauseFinish: schedule.pauseFinish,
                finishingHour: schedule.finishingHour,
                workingDay: schedule.workingDay
            }
        });

}

function validateScheduleHour(hour){
    let str = hour.split(":")

    if(str.length !== 2) return false

    return !((isNaN(parseInt(str[0])) || isNaN(parseInt(str[1])))
        || (str[0].length !== 2 || str[1].length !== 2));


}

async function newUser(user, id){
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, salt);

    return new User({
        _id: id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email.toLowerCase(),
        birthdate: user.birthdate,
        phoneNb: user.phoneNb,
        //TODO pour le moment on laisse, quand mail de vérif on avisera
        password: password,
        //TODO Mettre à jours le carnet de santé
        healthRecords: user.healthRecords
    })
}

async function newVet(user, id){
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, salt);

    let schedule = null
    if(user.schedule != null || user.schedule !== undefined){
        schedule = newSchedule(user.schedule)
    }

    return new User({
        _id: id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email.toLowerCase(),
        birthdate: user.birthdate,
        phoneNb: user.phoneNb,
        password: password,
        //TODO pour le moment on laisse, quand mail de vérif on avisera
        speciality: user.speciality,
        appointmentType: user.appointmentType,
        paymentMethod: user.paymentMethod,
        informations: user.informations,
        institutionName: user.institutionName,
        street: user.street,
        postalCode: user.postalCode,
        city: user.city,
        country: user.country,
        schedule: schedule,
        rpps: user.rpps,
    })
}
