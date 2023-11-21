const Router = require("express").Router
const router = Router()
const passport = require("passport")

const sessionController = require("../controllers/SessionController.js");

router.get("/github",passport.authenticate("github",{failureRedirect:"/errorGithub"}),(req,res)=>{})
router.get("/callbackGithub",passport.authenticate("github",{failureRedirect:"/errorGithub"}), sessionController.githubLogin )
router.get("/errorGithub", sessionController.errGithub )
router.post("/register", sessionController.register )
router.post("/login", sessionController.login )

module.exports = router