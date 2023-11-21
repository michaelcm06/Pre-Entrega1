const usersMongoDao = require("../dao/usersDao")


class usersService{

    constructor(dao){

      this.dao = new dao()

    }

    async verifyEmailUser( email ){

      return await this.dao.verifyEmailUser( email )

    }

    async createUser({nombre , apellido , edad , email , password , profile}){

      if(!apellido && !edad && !password){

        return await this.dao.createUser({ nombre , email , profile })

      }
      else{

         if(!profile){

          return await this.dao.createUser({ nombre , apellido , edad , email , password })
 
         }

      }
      

    }

    async userById( id ){

     return await this.dao.userById( id )

    }

}

module.exports = new usersService(usersMongoDao)