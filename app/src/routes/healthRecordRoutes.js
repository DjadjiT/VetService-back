const {authUser, authVet} = require("../services/authService")
const {postNewHealthRecord, putHealthRecord} = require("../controllers/healthRecordController")
const {healthRecordValidation, idValidation} = require("../services/healthRecordService")

const router = require("express").Router();

router.post("/", authUser, healthRecordValidation, postNewHealthRecord);
router.put("/", authUser, healthRecordValidation, idValidation, putHealthRecord);


module.exports = router;
