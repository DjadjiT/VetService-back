const {authUser} = require("../services/authService")
const {getAppointment, getMyAppointment, postAppointment, delteAppointment, getRequestAppointment,
    getVetDisponibility, moveAppointment} = require("../controllers/appointmentController")
const {appointmentValidation} = require("../services/appointmentService")

const router = require("express").Router();

router.post("/", authUser, appointmentValidation, postAppointment);
router.get("/:id", authUser, getAppointment);
router.get("/", authUser, getMyAppointment);
router.delete("/:id", authUser, delteAppointment);
router.post("/disponibility", authUser, getRequestAppointment);
router.post("/vet-disponibility/:id", authUser, getVetDisponibility);
router.put("/:id", authUser, moveAppointment);


module.exports = router;
