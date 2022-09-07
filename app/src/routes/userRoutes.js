const router = require("express").Router();
const {getCurrentUser, updateMyUser, updateSchedule, deleteUser} = require("../controllers/userController")
const {authUser, authVet} = require("../services/authService")
const {scheduleVerification} = require("../services/userService")


router.get("/", authUser, getCurrentUser);
router.put("/", authUser, updateMyUser);
router.delete("/", authUser, deleteUser);
router.put("/schedule/:id", authUser, authVet, scheduleVerification, updateSchedule);

module.exports = router;
