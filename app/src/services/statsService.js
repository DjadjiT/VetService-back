const User = require("../models/user");
const Appointment = require("../models/appointment");
const HR = require("../models/healthRecord");
const {ANIMALTYPE, ROLE} = require("../models/enum/enum")
const {appToDto} = require("./appointmentService")

exports.getUserStats = async () => {
    let client = await User.find({
        role: ROLE.client
    })
    let totalUser = await User.find()

    let vetNonActive = await User.find({role: ROLE.veterinary, active: false})
    let vetActive = await User.find({role: ROLE.veterinary, active: true})

    return {
        client: client.length,
        vetNonActive: vetNonActive.length,
        vetActive: vetActive.length,
        number: totalUser.length
    }
}

exports.getAppointmentsStats = async (startDate, endDate) => {
    let appointment = await Appointment.find()

    let dateFilter = []

    if(startDate !=null && endDate != null){
        let appDateList = await Appointment.find({
            requestDate: {
                $gte: startDate,
                $lt: endDate
            }
        })
        for(let app of appDateList){
            dateFilter.push(await appToDto(app))
        }
    }

    return {
        number : appointment.length,
        dateFilter: dateFilter,

    }
}

exports.getHRStats = async () => {
    let animalStats = []

    const animalList = Object.values(ANIMALTYPE)
    for(let animalType in ANIMALTYPE){
        animalStats.push({
            type: animalType,
            list: await HR.find({type: ANIMALTYPE[animalType]})
        })
    }
    const sum = animalStats.reduce((accumulator, object) => {
        return accumulator + object.list.length;
    }, 0);

    return {
        animalStats,
        sum
    }
}
