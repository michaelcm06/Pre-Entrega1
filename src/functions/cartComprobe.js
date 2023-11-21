const cartsService = require("../services/carts.service")
const usersService = require("../services/users.service")


async function cartComprobe(email){ 

const getUserByEmail = await usersService.verifyEmailUser( email )
     
if(!getUserByEmail){

   getUserByEmail = false

}else{
  
  //verificamos que el carrito exista
     const cartVerify = await cartsService.cartsByUserId(getUserByEmail._id)
  
  //si existe
     if(cartVerify){
        let cart = true

  //si no existe  
     }else{ 
        
        let idUser = getUserByEmail._id
        const cartCreate = await cartsService.createCart({idUser}) 
    }
}
}


module.exports = cartComprobe