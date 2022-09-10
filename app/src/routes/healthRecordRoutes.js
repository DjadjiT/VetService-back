const {authUser, authVet} = require("../services/authService")
const {postNewHealthRecord, putHealthRecord, getHealthRecord, deleteHealthRecord} = require("../controllers/healthRecordController")
const {healthRecordValidation, idValidation} = require("../services/healthRecordService")

const router = require("express").Router();

router.post("/", authUser, healthRecordValidation, postNewHealthRecord);
router.put("/", authUser, healthRecordValidation, idValidation, putHealthRecord);
router.delete("/:id", authUser, deleteHealthRecord);
router.get("/:id", authUser, getHealthRecord);


module.exports = router;
