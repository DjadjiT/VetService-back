const {UserDoesntExistError, UserError, HRExistError} = require("../configs/customError")
const { validationResult } = require("express-validator");
const {addNewHealthRecord, updateHealthRecord, deleteHealthRecord, getHealthRecordById} = require("../services/healthRecordService")

exports.postNewHealthRecord = async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    try{
        let result = await addNewHealthRecord(req.body, req.userId)
        return res.status(201).json(result)
    }catch (err){
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

exports.putHealthRecord = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    try{
        let result = await updateHealthRecord(req.body, req.userId)
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);

        if(err instanceof UserDoesntExistError || HRExistError){
            return res.status(404).json(err.message);
        }
        else if(err instanceof UserError){
            return res.status(400).json(err.message);
        }

        return res.status(400).json(err.message);
    }
}

exports.deleteHealthRecord = async (req, res) => {
    try{
        let result = await deleteHealthRecord(req.params.id, req.userId)
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);

        if(err instanceof UserDoesntExistError || HRExistError){
            return res.status(404).json(err.message);
        }
        else if(err instanceof UserError){
            return res.status(400).json(err.message);
        }

        return res.status(400).json(err.message);
    }
}

exports.getHealthRecord = async (req, res) => {
    try{
        let result = await getHealthRecordById(req.params.id, req.userId)
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);

        if(err instanceof UserDoesntExistError || HRExistError){
            return res.status(404).json(err.message);
        }
        else if(err instanceof UserError){
            return res.status(400).json(err.message);
        }

        return res.status(400).json(err.message);
    }
}
