const router = require("express").Router();
const {getAppointmentStats, getUserStats, getHRStats} = require("../controllers/statsController")
const {authUser, authAdmin} = require("../services/authService")

router.post("/appointment", authUser, authAdmin,  getAppointmentStats)
router.get("/user", authUser, authAdmin, getUserStats)
router.get("/hr", authUser, authAdmin, authUser, authAdmin, getHRStats)

module.exports = router;
