const  cartsMongoDao  = require("../dao/cartsDao")


class cartsService{

  constructor(dao){

     this.dao = new dao()

  }

  async getCarts(){

     return await this.dao.getCarts()

  }

  async addProduct( cartId , productId ){

    return await this.dao.addProduct( cartId , productId )

  }

  async createCart({idUser}){

     return await this.dao.create({idUser})

  }

  async cartsByUserId(idUser){

    return await this.dao.cartsByUserId(idUser)

  }

  async productInCartVerify( idUser , productId ){

   return await this.dao.productInCartVerify( idUser , productId)

  }

  async updateQuantity( cartId , productoId , quantity){

   return await this.dao.updateQuantity( cartId , productoId , quantity )

  }

  async deleteCartProduct( carritoId , productId ){

   return await this.dao.deleteCartProduct( carritoId , productId )

  }

  async cartDelete( id ){

  return await this.dao.cartDelete(id)

  }

}

module.exports = new cartsService(cartsMongoDao)