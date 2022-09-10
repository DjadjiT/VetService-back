const User = require("../models/user");
const {check} = require("express-validator");
const HealthRecord = require("../models/healthRecord");
const {ValidationError, UserDoesntExistError, AuthError, UserError, HRExistError} = require("../configs/customError")
const {ANIMALTYPE, SEX, ROLE} = require("../models/enum/enum")
const {validateDate, validateBirthDate} = require("../configs/validation")

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
    await validateUserRightOnHR(userId, healthRecord._id)

    return updateHR(healthRecord)
}

exports.deleteHealthRecord = async(hrId, userId) => {
    await validateUserRightOnHR(userId, hrId)

    return deleteHr(hrId)
}

exports.deleteHealthRecord = async(hrId, userId) => {
    await validateUserRightOnHR(userId, hrId)

    return deleteHr(hrId)
}

exports.getHealthRecordById = async(hrId, userId) => {
    return validateUserRightOnHR(userId, hrId)
}
exports.addNewHealthRecord = async(healthRecord, userId) => {
    let user = await User.findById(userId)
    if(!user) throw new UserDoesntExistError()

    let nHr = newHealthRecord(healthRecord)

    nHr = await nHr.save()
    user.healthRecords.push(nHr.id)


    await user.save()

    return nHr
}

async function validateUserRightOnHR(userId, hrId){
    let user = await User.findById(userId)
    if(!user) throw new UserDoesntExistError()

    if(user.healthRecords.find(e => e.equals(hrId))) throw new UserError("User cant add a vaccin to this HR")

    if(user.role===ROLE.veterinary) return

    let hr = await HealthRecord.findById(hrId)

    if(user.role===ROLE.veterinary) return hr

    if(!hr) throw new HRExistError()

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
        vaccins: newVaccins(healthRecord.vaccins, healthRecord.birthDate),
        notes: newNotes(healthRecord.notes)
    })
}

function deleteHr(hrId){
    return HealthRecord.deleteOne({_id: hrId})
}

exports.getHRById = async(id) => {
    let hr = await HealthRecord.findById(id)
    if(!hr) throw new HRExistError()
    return hr
}

function newVaccins(vaccins, birthDate){
    let vaccinList = []
    for(const v of vaccins){
        vaccinList.push(newVaccin(v, birthDate))
    }
    return vaccinList
}

function newVaccin(v, birthDate){
    if(v.dateRecall){
        return {
            name: v.name,
            dateVaccin: validateDate(v.dateVaccin, birthDate),
            dateRecall: validateDate(v.dateRecall, birthDate)
        }
    }else{
        return {
            name: v.name,
            dateVaccin: validateDate(v.dateVaccin, birthDate)
        }
    }
}

function newNote(n){
    return {
        informations: n.informations,
        date: validateDate(n.date, birthDate),
    }
}

function newNotes(notes){
    let notesList = []
    for(const n of notes){
        notesList.push(newNote(n))
    }
    return notesList
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
