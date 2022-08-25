const {registerClient} = require("../controllers/authController");
const {clientRegisterValidation} = require("../services/authService");
const router = require("express").Router();


router.post("/register", clientRegisterValidation, registerClient);


module.exports = router;
