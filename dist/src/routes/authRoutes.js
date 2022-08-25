const {registerClient, login} = require("../controllers/authController");
const {clientRegisterValidation, loginValidation} = require("../services/authService");
const router = require("express").Router();


router.post("/register", clientRegisterValidation, registerClient);
router.post("/login", loginValidation, login);


module.exports = router;
