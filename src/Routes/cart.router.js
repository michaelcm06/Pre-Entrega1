const Router = require("express").Router
const router = Router()

const cartsController = require("../controllers/CartsControllers.js");

router.get("/", cartsController.getCarts )

router.get("/:pid", cartsController.cartById )

router.post("/" , cartsController.cartCreate )

router.put("/:cid/products/:pid", cartsController.cartUpdate )

router.delete("/:cid/products/:pid", cartsController.cartProductDelete )

router.delete("/:cid", cartsController.cartDelete )



module.exports = router