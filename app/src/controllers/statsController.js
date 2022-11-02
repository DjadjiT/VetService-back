const { validationResult } = require("express-validator");
const {getUserStats, getAppointmentsStats, getHRStats} = require("../services/statsService")

exports.getAppointmentStats = async (req, res) =>{
    try{
        let result = await getAppointmentsStats(req.body.startDate, req.body.endDate)
        return res.status(200).json(result)
    }catch (err){
        return res.status(400).json(err.message);
    }
}

exports.getUserStats = async (req, res) =>{
    try{
        let result = await getUserStats()
        return res.status(200).json(result)
    }catch (err){
        return res.status(400).json(err.message);
    }
}

exports.getHRStats = async (req, res) =>{
    try{
        let result = await getHRStats()
        return res.status(200).json(result)
    }catch (err){
        return res.status(400).json(err.message);
    }
}
