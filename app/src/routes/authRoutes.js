const {registerClient, login, registerVet, verifyVet, deactivateUser, postAdmin,
    refuseVet} = require("../controllers/authController");
const {clientRegisterValidation, loginValidation, vetRegisterValidation, authUser , authAdmin} = require("../services/authService");
const router = require("express").Router();


router.post("/register/client", clientRegisterValidation, registerClient);
router.post("/register/admin", authUser , authAdmin, loginValidation, postAdmin);
router.post("/login", loginValidation, login);
router.post("/register/vet", clientRegisterValidation, vetRegisterValidation, registerVet);
router.put("/verify-vet/:id", authUser , authAdmin, verifyVet);
router.put("/deactivate/:id", authUser , authAdmin, deactivateUser);
router.put("/refuse/:id", authUser , authAdmin, refuseVet);


module.exports = router;
