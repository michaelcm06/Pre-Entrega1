const Router = require("express").Router
const router = Router()
const handleBars = require("express-handlebars")
const { inicializePassportJWT } = require("../config/jwt.config")
const passport = require("passport")
const { validarAdminJWT } = require("../utils")

const viewController = require("../controllers/ViewController");

router.get("/current", passport.authenticate( "current" , { session : false } ) , viewController.current )

router.get("/realtimeproducts", validarAdminJWT , viewController.realtimeproductsView )

router.get("/api/sessions/login", viewController.loginView )

router.get("/register", viewController.registerView )
 
router.get("/profile", viewController.profile )

router.get("/logout", viewController.deleteCookiesSession );
  
router.get("/", viewController.loginRedirection )




















/*

const products = path.join(__dirname,"..","archivosJson","products.json")

function getProducts(products){

    return  JSON.parse(fs.readFileSync(products))

}


function saveProducts(prod){

      fs.writeFileSync(products,JSON.stringify(prod))


}

*/




module.exports = router

