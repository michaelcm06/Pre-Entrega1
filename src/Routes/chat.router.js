const Router = require("express").Router
const router = Router()
const chat = require("../controllers/chatController.js")
const  { validarJWT } = require("../utils.js")


router.get("/" , validarJWT , chat )

module.exports = router