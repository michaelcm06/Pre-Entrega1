const chatModelo = require("../dao/models/chat.modelo")

class chatDao{

    constructor(){}

    async getChat(){

      return await chatModelo.find().lean()
    
    }

    async addMessage(message , user){

      return await chatModelo.create(message , user)

    }

}


module.exports = chatDao