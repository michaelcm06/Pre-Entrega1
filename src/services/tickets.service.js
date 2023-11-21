const ticketsDao = require("../dao/ticketsDao")


class ticketsService{

 constructor( dao ){

    this.dao = new dao()

 }

 async createTicket(  products , amount , userId , email , purchase_datetime  ){

    return await this.dao.createTicket(  products , amount , userId , email , purchase_datetime )

 }

}


module.exports = new ticketsService(ticketsDao)