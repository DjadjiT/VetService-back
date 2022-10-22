const router = require("express").Router();
const {getCurrentUser, updateMyUser, updateSchedule, deleteUser, getUser, getListUserByRole,
    getNotActiveVetList, deleteUserById, createSession} = require("../controllers/userController")
const {authUser, authVet, authAdmin} = require("../services/authService")
const {scheduleVerification} = require("../services/userService")


router.get("/", authUser, getCurrentUser);
router.get("/role-list/:role", authUser, authAdmin, getListUserByRole);
router.get("/invalid-vet", authUser, authAdmin, getNotActiveVetList);
router.get("/:id", authUser, getUser);
router.put("/", authUser, updateMyUser);
router.delete("/", authUser, deleteUser);
router.delete("/:userId", authUser, authAdmin, deleteUserById);
router.put("/schedule", authUser, authVet, scheduleVerification, updateSchedule);
router.post("/create-session", authUser, authVet, createSession);

module.exports = router;
