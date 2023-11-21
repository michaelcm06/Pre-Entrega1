const Router = require("express").Router
const router = Router()
const { validarJWT } = require("../utils.js")

const productsController = require("../controllers/ProductsControllers.js");

router.get("/", validarJWT , productsController.getProducts )

router.get("/:pid", productsController.productById )

router.post("/", productsController.postProducts )

router.put("/:pid", productsController.putProducts )

router.delete("/:pid", productsController.deleteProduct )

module.exports = router


