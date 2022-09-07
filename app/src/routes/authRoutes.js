const {registerClient, login, registerVet, verifyVet, deverifyVet} = require("../controllers/authController");
const {clientRegisterValidation, loginValidation, vetRegisterValidation, authUser , authAdmin} = require("../services/authService");
const router = require("express").Router();


router.post("/register/client", clientRegisterValidation, registerClient);
router.post("/login", loginValidation, login);
router.post("/register/vet", clientRegisterValidation, vetRegisterValidation, registerVet);
router.put("/verify-vet/:id", authUser , authAdmin, verifyVet);
router.put("/deverify-vet/:id", authUser , authAdmin, deverifyVet);


module.exports = router;
