const ticketsModelo = require("../dao/models/tickets.modelo")


class ticketsDao{

 constructor(){}

 async createTicket(  products , amount , userId , email , purchase_datetime ){


  return  await ticketsModelo.create({ products , amount , userId , email , purchase_datetime })

 }

}


module.exports = ticketsDao