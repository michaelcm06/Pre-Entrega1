const passportJWT= require("passport-jwt")
const passport = require("passport")
const config = require("../config/config")



const searchToken = (req) => {
     let token = null
     
     if(req.cookies.token){

        token = req.cookies.token
        console.log("token obtenido")
     }
     
     return token
     
}

const inicializePassportJWT = () =>{

    passport.use( "current" , new passportJWT.Strategy(

         { jwtFromRequest : passportJWT.ExtractJwt.fromExtractors([searchToken]),
        
           secretOrKey : config.PRIVATE_KEY00
        
        }, ( jwtcontent , done ) => {
            
              try{
              
                
                 done( null , jwtcontent)
                
              }catch(error){console.log(error)}

        } 
    ))


}

module.exports = inicializePassportJWT



