const {registerClient} = require("../services/authService")
const { validationResult } = require("express-validator");

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
