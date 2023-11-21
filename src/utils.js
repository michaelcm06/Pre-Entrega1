const jwt = require("jsonwebtoken")

const config = require("./config/config")
const generaJWT = ( usuario ) => jwt.sign ( { usuario } , config.PRIVATE_KEY00 , { expiresIn : "1h" } )
const generaAdminJWT = ( admin ) => jwt.sign ( { admin } , config.PRIVATE_KEY01 , { expiresIn : "1h"} )
const validarJWT = ( req , res , next ) =>{
  
        let getToken = req.cookies.token
        if( !getToken ){console.log("no existe la cookie token utils.js:11")}
        
        jwt.verify( getToken , config.PRIVATE_KEY00 , ( error , credenciales ) => {
          if( error ){
              
              res.redirect("/api/sessions/login")
            }else{
               
              console.log("credenciales obtenidas utils.js:27")         
            }
          next()

        })
}

const validarAdminJWT = ( req , res , next )=>{

   const admin = req.cookies.admin 
   if(!admin){

     return res.redirect("/api/products")
   }else{
   
     jwt.verify( admin , config.PRIVATE_KEY01 , (error , credenciales)=>{
       if(error){

         console.log("oh no, hubo un error en utils.js - linea : 53")
       }else{
         console.log("siii lo hicimos")
       }
       next()
     })
   }
}

module.exports = { generaJWT , validarJWT , generaAdminJWT , validarAdminJWT } 




