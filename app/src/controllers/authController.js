const {registerNewUser, loginUser, registerNewVet, verifyUser, deverifyUser, registerNewAdmin,
    refuseVet} = require("../services/authService")
const { validationResult } = require("express-validator");
const {ValidationError, UserDoesntExistError, AuthError, UserError} = require("../configs/customError")

exports.registerClient = async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation errors",
            errors
        });
    }
    try{
        let result = await registerNewUser(req.body)
        return res.status(201).json({result});
    }catch (err){
        console.error(err.message)
        return res.status(400).json(err.message);
    }

}

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation errors",
            errors
        });
    }
    try{
        const {email, password } = req.body;
        let token = await loginUser(email, password)
        return res.status(200).json({token});
    }catch (err){
        console.error(err.message);
        if(err instanceof UserDoesntExistError){
            return res.status(404).json(err.message);
        }
        else if(err instanceof AuthError){
            return res.status(412).json(err.message);
        }
        else if(err instanceof ValidationError|| err instanceof UserError){
            return res.status(401).json(err.message);
        }
        else{
            return res.status(400).json(err.message);
        }
    }

}

exports.registerVet = async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation errors",
            errors
        });
    }
    try{
        let result = await registerNewVet(req.body)
        return res.status(201).json({result});
    }catch (err){
        console.error(err.message)
        return res.status(400).json(err.message);
    }
}

exports.postAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation errors",
            errors
        });
    }
    try{
        let result = await registerNewAdmin(req.body)
        return res.status(201).json({result});
    }catch (err){
        console.error(err.message)
        return res.status(400).json(err.message);
    }
}

exports.verifyVet = async (req, res) =>{
    try{
        let result = await verifyUser(req.params.id)
        return res.status(200).json({result});
    }catch (err){
        console.error(err.message)
        return res.status(400).json(err.message);
    }
}


exports.deactivateUser = async (req, res) =>{
    try{
        let result = await deverifyUser(req.params.id)
        return res.status(200).json({result});
    }catch (err){
        console.error(err.message)
        return res.status(400).json(err.message);
    }
}

exports.refuseVet = async (req, res) =>{
    try{
        let result = await refuseVet(req.params.id)
        return res.status(200).json({result});
    }catch (err){
        console.error(err.message)
        return res.status(400).json(err.message);
    }
}

