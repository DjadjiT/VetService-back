const { validationResult } = require("express-validator");
const {createNewsletter, getAllNewsletter, deleteNewsletter} = require("../services/newsletterService")
const {NewsletterDoesntExistError} = require("../configs/customError");

exports.getAllNewsletter = async (req, res) =>{
    try{
        let result = await getAllNewsletter()
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}
exports.postNewsletter = async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    try{
        let result = await createNewsletter(req.body)
        return res.status(201).json(result)
    }catch (err){
        console.error(err.message);
        return res.status(400).json(err.message);
    }
}

exports.deleteNewsletter = async (req, res) =>{
    try{
        let result = await deleteNewsletter(req.params.id)
        return res.status(200).json(result)
    }catch (err){
        console.error(err.message);
        if(err instanceof NewsletterDoesntExistError){
            return res.status(404).json(err.message);
        }
        return res.status(400).json(err.message);
    }
}
