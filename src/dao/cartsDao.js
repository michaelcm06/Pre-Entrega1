const cartsModelo = require("../dao/models/carts.modelo")


class cartsMongoDao{

      constructor(){}


      async getCarts(){

        return await cartsModelo.find()

      }

      async create({idUser}){

       return await cartsModelo.create({idUser})

      }

      async cartsByUserId( idUser ){

      return await cartsModelo.findOne({ idUser : idUser })
    
    
     } 

      async productInCartVerify( idUser , productId ){

       return await cartsModelo.findOne({idUser : idUser , "products.product" : productId })

      }

     async updateQuantity( idUser , productoId , quantity ){

      return await cartsModelo.updateOne({ idUser : idUser , "products.product" : productoId},{$inc:{"products.$.quantity": quantity}})
     
     }

     async addProduct( cartId , productId){

      return await cartsModelo.updateOne({ idUser : cartId },{ $push : { products : { product :  productId , quantity : 1 }} })

     }

     async deleteCartProduct( carritoId , productId ){

      return await cartsModelo.updateOne( { _id : carritoId } , {$pull : {products : {product : productId} } } )

     }

     async cartDelete( id ){

      return await cartsModelo.deleteOne({ _id : id })

     }
}

module.exports = cartsMongoDao