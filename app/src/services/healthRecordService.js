const User = require("../models/user");
const {check} = require("express-validator");
const HealthRecord = require("../models/healthRecord");
const Appointment = require("../models/appointment");
const userService = require("./userService")
const {deleteAppointmentByHRId} = require("./appointmentService")
const {ValidationError, UserDoesntExistError, UserError, HRExistError, HRError} = require("../configs/customError")
const {ANIMALTYPE, SEX, ROLE} = require("../models/enum/enum")
const {validateBirthDate} = require("../configs/validation")
const {sendHRMailTo} = require("../services/smtpService")
const {MAILACTION} = require("../models/enum/enum")


exports.healthRecordValidation = [
    check("type", "type is required").not().isEmpty(),
    check("name", "name is required").not().isEmpty(),
    check("race", "race is required").not().isEmpty(),
    check("sex", "sex is required").not().isEmpty(),
    check("sterilised", "sterilised is required").not().isEmpty(),
    check("sterilised", "sterilised is not a boolean").isBoolean(),
    check("birthDate", "birthDate is required").not().isEmpty(),
];

exports.idValidation = [
    check("_id", "Id is required").not().isEmpty(),
];

exports.updateHealthRecord = async(healthRecord, userId) => {
    let hr = await validateUserRightOnHR(userId, healthRecord._id, "put")

    return updateHR(healthRecord)
}

exports.deleteHealthRecord = async(hrId, userId) => {
    let hr = await validateUserRightOnHR(userId, hrId, "delete")

    deleteHr(hrId)
    await deleteAppointmentByHRId(hrId)

    let user = await User.findById(userId)
    sendHRMailTo(user, MAILACTION.HRDELETION, hr)

    return userService.removeHealthRecord(hrId, userId)
}

exports.getHealthRecordById = async(hrId, userId) => {
    let hr = await validateUserRightOnHR(userId, hrId, "get")
    return hrToDto(hr)
}

exports.hrFindById = async(hrId) => {
    let hr = await HealthRecord.findById(hrId)
    return hrToDto(hr)
}

exports.addNewHealthRecord = async(healthRecord, userId) => {
    let user = await User.findById(userId)
    if(!user) throw new UserDoesntExistError()

    let nHr = newHealthRecord(healthRecord)

    nHr = await nHr.save()
    user.healthRecords.push(nHr.id)


    sendHRMailTo(user, MAILACTION.HRCREATION, nHr)

    await user.save()

    return nHr
}

async function validateUserRightOnHR(userId, hrId, action){
    let hr = await HealthRecord.findById(hrId)

    if(!hr) throw new HRExistError()
    if(hr.deleted && action!=="get") throw new HRError("This HR is deleted, you can't access it!")


    let user = await User.findById(userId)
    if(!user) throw new UserDoesntExistError()


    if(user.role===ROLE.veterinary) return hr

    if(!(user.healthRecords.find(e => e.toString() === hrId))) throw new UserError("User cant access to this HR")

    return hr
}

function newHealthRecord(healthRecord) {
    return new HealthRecord({
        type: validateAnimalType(healthRecord.type),
        name: healthRecord.name,
        race: healthRecord.race,
        sex: validateAnimalSex(healthRecord.sex),
        sterilised: healthRecord.sterilised,
        birthDate: validateBirthDate(healthRecord.birthDate),
        vaccins: healthRecord.vaccins,
        notes: healthRecord.notes,
    })
}

function updateHR(healthRecord) {
    return HealthRecord.updateOne({
            _id: healthRecord._id
        },
        {
        type: validateAnimalType(healthRecord.type),
        name: healthRecord.name,
        race: healthRecord.race,
        sex: validateAnimalSex(healthRecord.sex),
        sterilised: healthRecord.sterilised,
        birthDate: validateBirthDate(healthRecord.birthDate),
        vaccins: healthRecord.vaccins,
        notes: healthRecord.notes,
    })
}

function deleteHr(hrId){
    return HealthRecord.updateOne({
        _id: hrId
    }, {
        deleted: true
    })
}

exports.getHRById = async(id) => {
    let hr = await HealthRecord.findById(id)
    if(!hr) throw new HRExistError()
    return hr
}

function validateAnimalType(type){
    for(const a of Object.values(ANIMALTYPE)){
        if(a.toLowerCase() === type.toLowerCase()){
            return a
        }
    }
    throw new ValidationError("Animal type doesnt exist.")
}

function validateAnimalSex(sex){
    for(const s of Object.values(SEX)){
        if(s.toLowerCase() === sex.toLowerCase()){
            return s
        }
    }
    throw new ValidationError("Animal sex doesnt exist.")
}

function hrToDto(hr){
    return {
        id: hr._id,
        type: hr.type,
        name: hr.name,
        race: hr.race,
        sex: hr.sex,
        sterilised: hr.sterilised,
        birthDate: hr.birthDate,
        vaccins: hr.vaccins,
        notes: hr.notes,
        deleted: hr.deleted
    }
}
