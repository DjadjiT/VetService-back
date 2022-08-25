const {registerClient, loginUser} = require("../services/authService")
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
        let result = await registerClient(req.body)
        res.status(201).json({result});
    }catch (err){
        console.log(err)
        res.status(400).json(error(err.message));
    }

}

exports.login = async (res, req) => {
    console.log(req.body)
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
        res.status(200).json({token});
    }catch (err){
        console.error(err.message);
        if(err instanceof UserDoesntExistError){
            res.status(404).json(error(err.message, res.statusCode));
        }
        else if(err instanceof AuthError || err instanceof UserError){
            res.status(412).json(error(err.message, res.statusCode));
        }
        else if(err instanceof ValidationError){
            res.status(401).json(error(err.message, res.statusCode));
        }
        else{
            res.status(400).json(error(err.message, res.statusCode));
        }
    }

}
