const {newAppointment, getAppointmentById, deleteAppointmentById, getAppointmentByUserId,
    retrivePossibleDate, getVetDisponibility, moveAppointmentDate} = require("../services/appointmentService")
const { validationResult } = require("express-validator");
const {ValidationError, UserDoesntExistError, AuthError, AppointmentError, UserError, HRExistError} = require("../configs/customError")

exports.postAppointment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation errors",
            errors
        });
    }
    try{
        let result = await newAppointment(req.body, req.userId)
        return res.status(201).json({result});
    }catch (err){
        handleErrorMessage(err, res)
    }
}

exports.getAppointment = async (req, res) => {
    try{
        let result = await getAppointmentById(req.params.id, req.userId)
        return res.status(200).json({result});
    }catch (err){
        handleErrorMessage(err, res)
    }
}

exports.getMyAppointment = async (req, res) => {
    try{
        let result = await getAppointmentByUserId(req.userId)
        return res.status(200).json(result);
    }catch (err){
        handleErrorMessage(err, res)
    }
}

exports.delteAppointment = async (req, res) => {
    try{
        let result = await deleteAppointmentById(req.params.id, req.userId)
        return res.status(200).json({result});
    }catch (err){
        handleErrorMessage(err, res)
    }
}

exports.getRequestAppointment = async (req, res) => {
    try{
        let result = await retrivePossibleDate(req.body.filter)
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}


exports.getVetDisponibility = async (req, res) => {
    try{
        let result = await getVetDisponibility(req.params.id, req.body.date)
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

exports.moveAppointment = async (req, res) => {
    try{
        let result = await moveAppointmentDate(req.body, req.params.id, req.userId)
        return res.status(200).json({result});
    }catch (err){
        handleErrorMessage(err, res)
    }
}


function handleErrorMessage(err, res){
    console.error(err.message);
    if(err instanceof UserDoesntExistError || err instanceof AppointmentError){
        return res.status(404).json(err.message);
    }
    else if(err instanceof AuthError || err instanceof UserError || err instanceof ValidationError){
        return res.status(412).json(err.message);
    }
    else{
        return res.status(400).json(err.message);
    }
}
