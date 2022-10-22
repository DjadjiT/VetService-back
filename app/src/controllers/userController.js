const {UserDoesntExistError, UserError} = require("../configs/customError")
const { validationResult } = require("express-validator");
const {getCurrent, updateCurrent, updateVetSchedule, deleteCurrent, getUserById, getUserByRole,
    getNotActiveVet, deleteUserById, createSession} = require("../services/userService")

exports.getCurrentUser = async (req, res) =>{
    try{
        let result = await getCurrent(req.userId)
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);
        if(err instanceof UserDoesntExistError){
            return res.status(404).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }
}

exports.getUser = async (req, res) =>{
    try{
        let result = await getUserById(req.params.id)
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);
        if(err instanceof UserDoesntExistError){
            return res.status(404).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }
}

exports.getListUserByRole = async (req, res) =>{
    try{
        let result = await getUserByRole(req.params.role)
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);
        if(err instanceof UserDoesntExistError){
            return res.status(404).json(err.message);
        }
        else if(err instanceof UserError){
            return res.status(403).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }
}

exports.getNotActiveVetList = async (req, res) =>{
    try{
        let result = await getNotActiveVet()
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);
        if(err instanceof UserDoesntExistError){
            return res.status(404).json(err.message);
        }
        else if(err instanceof UserError){
            return res.status(403).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }
}

exports.updateMyUser = async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    try{
        let result = await updateCurrent(req.body, req.userId)
        return res.status(200).json({
            message: "User updated",
            result: result
        })
    }catch (err){
        console.error(err.message);
        if(err instanceof UserDoesntExistError){
            return res.status(404).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }
}

exports.updateSchedule = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    try{
        let result = await updateVetSchedule(req.userId, req.body)
        return res.status(200).json({
            message: "User updated",
            result: result
        })
    }catch (err){
        console.error(err.message);
        if(err instanceof UserError){
            return res.status(403).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }
}

exports.deleteUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    try{
        await deleteCurrent(req.userId)
        return  res.status(200).json({
            message: "User deleted"
        })
    }catch (err){
        console.error(err.message);
        if(err instanceof UserError){
            return res.status(403).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }
}


exports.deleteUserById = async (req, res) => {
    try{
        await deleteUserById(req.params.userId)
        return  res.status(200).json({
            message: "User deleted"
        })
    }catch (err){
        console.error(err.message);
        if(err instanceof UserError){
            return res.status(403).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }
}

exports.createSession = async (req, res) => {
    try{
        const session = await createSession(req.userId)
        return  res.status(200).json({
            sessionId: session.id
        })
    }catch (err){
        console.error(err.message);
        if(err instanceof UserError){
            return res.status(403).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }
}
