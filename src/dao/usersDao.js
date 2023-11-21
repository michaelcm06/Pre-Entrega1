const usersModelo = require("./models/users.modelo")
const  dao  = require("../config/factory")


class usersMongoDao{

   constructor(){}


   async verifyEmailUser(email){

    return await dao.findOne({email:email})

   }

   async createUser({nombre , apellido , edad , email , password , profile}){
   
      if(!apellido && !edad && !password){
        
         return await dao.create({ nombre : nombre , email : email , profile : profile })
     
       }
      else{
       if(!profile){

         return await dao.create({ nombre , apellido , edad , email , password })

      }


  }
}

   async userById( id ){

    return await dao.findOne({ _id : id })

   }
}

module.exports = usersMongoDao