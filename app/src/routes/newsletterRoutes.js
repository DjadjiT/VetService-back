const router = require("express").Router();
const {getAllNewsletter, postNewsletter, deleteNewsletter} = require("../controllers/newsletterController")
const {newsletterCreation} = require("../services/newsletterService")
const {authUser, authAdmin} = require("../services/authService")

router.get("/", authUser, authAdmin, getAllNewsletter)
router.post("/", authUser, authAdmin, newsletterCreation, postNewsletter)
router.get("/:id", authUser, authAdmin, deleteNewsletter)

module.exports = router;
