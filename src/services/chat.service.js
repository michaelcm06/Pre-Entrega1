const chatDao = require("../dao/chatDao")

class chatService{

   constructor(dao){
      this.dao = new dao()

   }

   async getChat(){

     return await this.dao.getChat()

   }

   async addMessage(message , user){

     return await this.dao.addMessage(message , user)

   }

}

module.exports = new chatService(chatDao)