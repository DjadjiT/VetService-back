const router = require("express").Router();
const {getCurrentUser, updateMyUser, updateSchedule, deleteUser, getUser} = require("../controllers/userController")
const {authUser, authVet} = require("../services/authService")
const {scheduleVerification} = require("../services/userService")


router.get("/", authUser, getCurrentUser);
router.get("/:id", authUser, getUser);
router.put("/", authUser, updateMyUser);
router.delete("/", authUser, deleteUser);
router.put("/schedule", authUser, authVet, scheduleVerification, updateSchedule);

module.exports = router;
