const {check} = require("express-validator");
const User = require("../models/user");
const Appointment = require("../models/appointment");
const HealthRecord = require("../models/healthRecord");
const {ValidationError, UserDoesntExistError, AuthError, AppointmentError, UserError, HRExistError} = require("../configs/customError")
const {ROLE} = require("../models/enum/enum")
const {validateAppointmentDate} = require("../configs/validation")
const {userToDto} = require("../services/userService")

const moment = require("moment")

exports.appointmentValidation = [
    check("date", "date is required").not().isEmpty(),
    check("veterinary", "veterinary is required").not().isEmpty(),
    check("appointmentType", "appointmentType is required").not().isEmpty(),
    check("healthRecord", "healthRecord is required").not().isEmpty(),
    //check("appointementDuration", "appointementDuration is required").not().isEmpty(),
];

exports.appointmentUserUpdateValidation = [
    check("date", "date is required").not().isEmpty(),
    check("date", "date is required").isDate(),
    check("appointmentType", "appointmentType is required").not().isEmpty(),
    check("healthRecord", "healthRecord is required").not().isEmpty(),
    //check("appointementDuration", "appointementDuration is required").not().isEmpty(),
];

exports.newAppointment = async(body, userId) => {
    let user = await User.findById(userId)
    if(!user) throw new UserDoesntExistError()

    let vet = await User.findById(body.veterinary)
    if(!vet) throw new UserDoesntExistError()
    if(vet.role !== ROLE.veterinary) throw UserError("Can't book an appointment with a user that is not a veterinary.")
    if(!vet.active) throw UserError("Can't book an appointment with a veterinary without an active account.")

    let hr = await HealthRecord.findById(body.healthRecord)
    if(!hr) throw new HRExistError()

    if(!(await isAppointmentAvailable(vet, new Date(body.date)))) throw new AppointmentError("Vet not available at this time.")


    let appointment = new Appointment({
        date: validateAppointmentDate(body.date),
        client: user._id,
        veterinary: vet._id,
        appointmentType: verifyAppointmentType(vet, body.appointmentType),
        requestDate: new Date(),
        healthRecord: body.healthRecord,
        appointementDuration: 30,
    })

    return appointment.save()
}

exports.getAppointmentById = async(appId, userId) => {
    return validateRightOnAppointment(appId, userId)
}

exports.getAppointmentByUserId = async(userId) => {
    let appList = await Appointment.find({
        client: userId
    })

    let past = []
    let future = []

    for(const a of appList){
        if(a.date<new Date()){
            past.push(a)
        }else{
            future.push(a)
        }
    }
    return {
        past,
        future
    }

}

exports.deleteAppointmentById = async (appId, userId) => {
    let app = await validateRightOnAppointment(appId, userId)
    if(!app.client.equals(userId)) throw new AuthError("You don't have the rights to delete this appointment.")

    //TODO Cancel appointment => avec messagerie

    return Appointment.deleteOne({_id: app._id})
}

exports.moveAppointmentDate = async(body, appId, userId) => {
    let app = await validateRightOnAppointment(appId, userId)

    if(!app.client.equals(userId)) throw new AuthError("You don't have the rights to delete this appointment.")

    let vet = await User.findById(app.veterinary)

    if(!(await isAppointmentAvailable(vet, new Date(body.date)))) throw new AppointmentError("Vet not available at this time.")

    return Appointment.updateOne({
        _id: appId
        },
        {
        date: validateAppointmentDate(body.date),
        requestDate: new Date(),
    })
}

exports.getVetDisponibility = async(vetId, date) => {
    let vet = await User.findById(vetId)
    if(!vet) throw new UserDoesntExistError()

    return getDisponibilityForVet(vet, new Date(date))
}

exports.retrivePossibleDate = async (filter) =>{
    date = new Date(filter.date)

    let vetList = await User.find({
        role: ROLE.veterinary,
        active: true,
        postalCode: filter.postalCode.toLowerCase(),
        speciality: filter.speciality.toLowerCase(),
        city: filter.city.toLowerCase()
    })

    let appointmentList = []
    for(const v of vetList){
        let dispo = await getDisponibilityForVet(v, date)
        if(dispo!==null) appointmentList.push(dispo)

    }
    return appointmentList

}

async function getDisponibilityForVet(vet, date){
    let userDto = userToDto(vet)
    let dispoList = []

    try{
        if(vet.schedule.workingDay[(date.getDay()-1)%7]){
            let startingHourSplit = vet.schedule.startingHour.split(":")
            let pauseStartSplit = vet.schedule.pauseStart.split(":")

            let startingHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startingHourSplit[0], startingHourSplit[1])
            let pauseStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), pauseStartSplit[0], pauseStartSplit[1])

            let morningAppointment = await findAppointmentWithDateFilter(startingHour, pauseStart)

            let pauseFinishSplit = vet.schedule.pauseFinish.split(":")
            let finishingHourSplit = vet.schedule.finishingHour.split(":")

            let pauseFinish = new Date(date.getFullYear(), date.getMonth(), date.getDate(), pauseFinishSplit[0], pauseFinishSplit[1])
            let finishingHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), finishingHourSplit[0], finishingHourSplit[1])

            let afternoonAppointment = await findAppointmentWithDateFilter(pauseFinish, finishingHour)

            let morningPossibleAppointment = getPossibleAppoinmentList(startingHour, pauseStart)
            let afternoonPossibleAppointment = getPossibleAppoinmentList(pauseFinish, finishingHour)

            dispoList = getDisponibilityList(morningPossibleAppointment, morningAppointment).concat(
                getDisponibilityList(afternoonPossibleAppointment, afternoonAppointment))
        }
    }catch (err){
        return {
            dispoList,
            vet: userDto
        }
    }
    return {
        dispoList,
        vet: userDto
    }

}

async function isAppointmentAvailable(vet, date){
    if(date<new Date()) return false
    if(!vet.schedule.workingDay[(date.getDay()-1)%7]) return false

    if(!isBetweenWorkingHour(vet, date)) return false

    let appointment = await Appointment.find({
        veterinary: vet._id,
        date: {
            $gte: moment(date).subtract(29, 'm'),
            $lt: moment(date).add(29, 'm')
        }
    })

    return appointment.length===0
}

function isBetweenWorkingHour(vet, date){
    let startingHourSplit = vet.schedule.startingHour.split(":")
    let pauseStartSplit = vet.schedule.pauseStart.split(":")

    let startingHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startingHourSplit[0], startingHourSplit[1])
    let pauseStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), pauseStartSplit[0], pauseStartSplit[1])

    let pauseFinishSplit = vet.schedule.pauseFinish.split(":")
    let finishingHourSplit = vet.schedule.finishingHour.split(":")

    let pauseFinish = new Date(date.getFullYear(), date.getMonth(), date.getDate(), pauseFinishSplit[0], pauseFinishSplit[1])
    let finishingHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), finishingHourSplit[0], finishingHourSplit[1])

    return (moment(date).isAfter(startingHour) && moment(date).isBefore(pauseStart)) ||
        (moment(date).isAfter(pauseFinish) && moment(date).isBefore(finishingHour))
}

function getDisponibilityList(possibleAppointment, appointment){
    let disponibilityList = []
    if(appointment.length === 0) return possibleAppointment

    for(const strDate of possibleAppointment){
        for(const date of appointment){
            const d = new Date(strDate)
            if(!(d>=date.date && d<moment(date.date).add(29, 'm'))){
                disponibilityList.push(d)
            }
        }
    }
    return disponibilityList
}

function getPossibleAppoinmentList(hourA, hourB){
    let possibleAppointment = []

    for(let i = hourA ; i<hourB; ){
        possibleAppointment.push(i)
        i = moment(i).add(30, 'm').toDate()
    }
    return possibleAppointment
}

function verifyAppointmentType(vet, appointmentType) {
    let f = vet.appointmentType.find(e => e.toLowerCase() === appointmentType.toLowerCase())
    if(!f) throw ValidationError("Appointment type doesnt exist.")
    return f

}

async function validateRightOnAppointment(appId, userId){
    let user = await User.findById(userId)
    if(!user) throw new UserDoesntExistError()

    let app = await Appointment.findById(appId)
    if(!app) throw new AppointmentError("Appointment doesnt exist")

    if(!(app.client.equals(userId) || app.veterinary.equals(userId))) throw new AuthError("You cant access this appointment.")

    return app
}

function findAppointmentWithDateFilter(hourA, hourB){
    return Appointment.find({
        date: {
            $gte: hourA,
            $lt: hourB
        }
    })
}
