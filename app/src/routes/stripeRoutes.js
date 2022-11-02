const router = require("express").Router();
const {getUserSuscription, getMySuscription, getProductList, buyProducts, webHookCompleteOrder,
    putOrder, getOrderByStatus, getOrders} = require("../controllers/stripeController")
const {authUser, authVet, authAdmin, getUserId} = require("../services/authService")

router.post("/product", getUserId, buyProducts)
router.get("/suscription", authUser, authVet, getMySuscription)
router.get("/suscription/:userId", authUser, authAdmin, getUserSuscription)
router.get("/product-list", getProductList)
router.post("/webhook", webHookCompleteOrder)
router.put("/order/:id", authUser, authAdmin, putOrder)
router.get("/order", authUser, authAdmin, getOrderByStatus)
router.get("/orders", authUser, authAdmin, getOrders)

module.exports = router;
