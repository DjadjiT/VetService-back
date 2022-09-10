const {ValidationError} = require("../configs/customError")
exports.validateDate = (date, birthdate) => {
    let d = new Date(date)
    if(d < new Date(birthdate)) throw new ValidationError("Date not possible." +date)

    return d
}

exports.validateBirthDate = (date) => {
    if(new Date(date)> new Date()) throw new ValidationError("Birthdate is not possible.")

    return new Date(date)
}

exports.validateAppointmentDate = (date) => {
    if(new Date(date) < new Date()) throw new ValidationError("Appointment date is not possible.")

    return new Date(date)
}
