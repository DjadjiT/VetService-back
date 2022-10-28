const router = require("express").Router();
const {getUserSuscription, getMySuscription, getProductList, buyProducts} = require("../controllers/stripeController")
const {authUser, authVet, authAdmin, getUserId} = require("../services/authService")

router.post("/product", getUserId, buyProducts)
router.get("/suscription", authUser, authVet, getMySuscription)
router.get("/suscription/:userId", authUser, authAdmin, getUserSuscription)
router.get("/product-list", getProductList)

module.exports = router;
