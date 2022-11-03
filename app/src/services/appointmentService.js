const {check} = require("express-validator");
const User = require("../models/user");
const Appointment = require("../models/appointment");
const HealthRecord = require("../models/healthRecord");
const {ValidationError, UserDoesntExistError, AuthError, AppointmentError, UserError, HRExistError} = require("../configs/customError")
const {ROLE, MAILACTION} = require("../models/enum/enum")
const {validateAppointmentDate} = require("../configs/validation")
const {userToDto, getUserById} = require("../services/userService")
const healthRecordService = require("./healthRecordService")
const {sendAppointmentMailTo} = require("./smtpService")

const moment = require("moment")

exports.appointmentValidation = [
    check("date", "date is required").not().isEmpty(),
    check("veterinary", "veterinary is required").not().isEmpty(),
    check("appointmentType", "appointmentType is required").not().isEmpty(),
    check("healthRecord", "healthRecord is required").not().isEmpty(),
];

exports.appointmentUserUpdateValidation = [
    check("date", "date is required").not().isEmpty(),
    check("date", "date is required").isDate(),
    check("appointmentType", "appointmentType is required").not().isEmpty(),
    check("healthRecord", "healthRecord is required").not().isEmpty(),
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

    sendAppointmentMailTo(MAILACTION.APPOINTMENT, appointment, user, vet)

    return appointment.save()
}

exports.getAppointmentById = async(appId, userId) => {
    return validateRightOnAppointment(appId, userId)
}

exports.getAppointmentByUserId = async(userId) => {
    let user = await getUserById(userId)

    let appList = []

    if(user.role === ROLE.client){
        appList = await Appointment.find({
            client: userId
        })
    }else if(user.role === ROLE.veterinary){
        appList = await Appointment.find({
            veterinary: userId
        })
    }

    let past = []
    let future = []

    for(const a of appList){
        if(a.date<new Date()){
            past.push(await appointmentDto(a, userId))
        }else{
            future.push(await appointmentDto(a, userId))
        }
    }
    return {
        past,
        future
    }

}

exports.adminGetAppointmentByUserId = async(userId) => {
    let user = await getUserById(userId)

    let appList = []

    if(user.role === ROLE.client){
        appList = await Appointment.find({
            client: userId
        })
    }else if(user.role === ROLE.veterinary){
        appList = await Appointment.find({
            veterinary: userId
        })
    }

    let res = []

    for(const a of appList){
        res.push(await appointmentDto(a, userId))
    }
    return res

}

exports.deleteAppointmentById = async (appId, userId) => {

    let app = await validateRightOnAppointment(appId, userId)
    if(!(app.client.equals(userId) || app.veterinary.equals(userId))) throw new AuthError("You don't have the rights to delete this appointment.")


    let user = await User.findById(app.client)
    let vet = await User.findById(app.veterinary)

    let del = await Appointment.deleteOne({_id: app._id})
    await sendAppointmentMailTo(MAILACTION.APPOINTMENTDELETE, app, user, vet)

    return del
}

exports.deleteAppointmentByHRId = async (hrId) => {

    return Appointment.deleteMany({healthRecord: hrId})
}

exports.moveAppointmentDate = async(body, appId, userId) => {
    let app = await validateRightOnAppointment(appId, userId)

    if(!app.client.equals(userId)) throw new AuthError("You don't have the rights to move this appointment.")

    let user = await User.findById(app.client)
    let vet = await User.findById(app.veterinary)

    if(!(await isAppointmentAvailable(vet, new Date(body.date)))) throw new AppointmentError("Vet not available at this time.")



    sendAppointmentMailTo(MAILACTION.APPOINTMENTUPDATE, app, user, vet)

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
    let date = new Date(filter.date)

    let vetList


    if(filter.postalCode === null || filter.postalCode.length===0){
        vetList = await User.find({
            role: ROLE.veterinary,
            active: true,
            speciality: filter.speciality.toLowerCase(),
            city: filter.city.toLowerCase()
        })
    }else {

        vetList = await User.find({
            role: ROLE.veterinary,
            active: true,
            postalCode: filter.postalCode,
            speciality: filter.speciality.toLowerCase(),
            city: filter.city.toLowerCase()
        })
    }


    let appointmentList = []
    for(const v of vetList){
        let dispo = await getDisponibilityForVet(v, new Date(date))

        if(dispo.dispoList.length>0){
            appointmentList.push(dispo)
        }

    }
    return appointmentList

}

async function appointmentDto(app, userId) {
    let vet = await getUserById(app.veterinary)
    let client = await getUserById(app.client)
    let hr = await healthRecordService.hrFindById(app.healthRecord, userId)

    return {
        id: app._id,
        date: app.date,
        client: client,
        veterinary: vet,
        appointmentType: app.appointmentType,
        requestDate: app.requestDate,
        healthRecord: hr,
        appointementDuration: app.appointementDuration,
    }
}

exports.appToDto = async (app, userId) => {
    return appointmentDto(app, userId)
}

async function getDisponibilityForVet(vet, date){
    let userDto = userToDto(vet)
    let dispoList = []
    let offset = 60*Number(process.env.OFFSET)
    date = new Date(date.getTime()+offset*60*1000)

    try{
        if(vet.schedule.workingDay[(date.getDay()-1)%7]){

            let startingHourSplit = vet.schedule.startingHour.split(":")
            let pauseStartSplit = vet.schedule.pauseStart.split(":")

            let startingHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startingHourSplit[0], startingHourSplit[1])
            let pauseStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), pauseStartSplit[0], pauseStartSplit[1])

            let morningAppointment = await findAppointmentWithDateFilter(startingHour, pauseStart, vet._id)

            let pauseFinishSplit = vet.schedule.pauseFinish.split(":")
            let finishingHourSplit = vet.schedule.finishingHour.split(":")

            let pauseFinish = new Date(date.getFullYear(), date.getMonth(), date.getDate(), pauseFinishSplit[0], pauseFinishSplit[1])
            let finishingHour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), finishingHourSplit[0], finishingHourSplit[1])

            let afternoonAppointment = await findAppointmentWithDateFilter(pauseFinish, finishingHour, vet._id)


            let morningPossibleAppointment = getPossibleAppoinmentList(startingHour, pauseStart)
            let afternoonPossibleAppointment = getPossibleAppoinmentList(pauseFinish, finishingHour)

            let morningAppDateList = []
            let afterNoonAppDateList = []

            for(let morning of morningAppointment){
                morningAppDateList.push(morning.date)
            }
            for(let afternoon of afternoonAppointment){
                afterNoonAppDateList.push(afternoon.date)
            }

            dispoList = getDisponibilityList(morningPossibleAppointment, morningAppDateList).concat(
                getDisponibilityList(afternoonPossibleAppointment, afterNoonAppDateList))
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

    console.log(startingHour)
    console.log(pauseStart)
    console.log(pauseFinish)
    console.log(finishingHour)
    console.log("------------------")
    console.log(date)
    console.log("------------------")

    return (moment(pauseStart).isSameOrAfter(date) && moment(startingHour).isSameOrBefore(date)) ||
        (moment(finishingHour).isSameOrAfter(date) && moment(pauseFinish).isSameOrBefore(date))
}

function getDisponibilityList(possibleAppointment, appointments){
    let disponibilityList = []
    if(appointments.length === 0) return possibleAppointment

    for(const strDate of possibleAppointment){

        const d = new Date(strDate)


        let exist = false

        for(let date of appointments){

            if((moment(d).add(29, 'm').isAfter(date) && moment(d).isBefore(date)) ||
                moment(d).subtract(29, 'm').isBefore(date) && moment(d).isAfter(date) || moment(d).isSame(date)){
                exist = true
            }
        }

        if(!(exist)){
            disponibilityList.push(d)
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

function findAppointmentWithDateFilter(hourA, hourB, vetId){
    return Appointment.find({
        veterinary: vetId,
        date: {
            $gte: hourA,
            $lt: hourB
        }
    })
}
