const router = require("express").Router();
const {getUserSuscription, getMySuscription, getProductList, buyProduct} = require("../controllers/stripeController")
const {authUser, authVet, authAdmin, getUserId} = require("../services/authService")

router.get("/suscription", authUser, authVet, getMySuscription)
router.get("/suscription/:userId", authUser, authAdmin, getUserSuscription)
router.get("/product-list", getProductList)
router.get("/product", getUserId, buyProduct)

module.exports = router;
