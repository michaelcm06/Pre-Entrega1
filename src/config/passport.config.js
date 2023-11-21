const passport = require("passport")
const github = require("passport-github2")
const usersService = require("../services/users.service")

const inicializaPassport = ()=>{

   passport.use("github", new github.Strategy({

     clientID:"Iv1.57172691f62bef81",
     clientSecret:"2a4922cf430c68357a0c443e32634bd6bcb45a24",
     callbackURL:"http://localhost:8080/sessions/callbackGithub"
    

   },
   async(profile , done )=>{

    try{
      if(profile){
        console.log(profile)
        console.log(profile._json.email)
      }
         let findUser = await usersService.verifyEmailUser(profile._json.email)
         if(!findUser){
             
               findUser = await usersService.createUser({  nombre : profile._json.name , email : profile._json.email , profile : profile })

         }
        
         done(null,findUser)
    }
    catch(error){done(error)}

 
   }
   
   
   ))
   passport.serializeUser((findUser,done)=>{
     return done(null,findUser._id)

   })
   passport.deserializeUser(async(id,done)=>{


    findUser = await usersService.userById( id )
    return done(null,findUser)
   })

}

module.exports = inicializaPassport