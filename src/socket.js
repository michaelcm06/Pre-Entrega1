const socketIO = require("socket.io");
const productsService = require("./services/products.service");
const chatService = require("./services/chat.service");
const cartsService = require("./services/carts.service");
const usersService = require("./services/users.service");
const mongoose = require("mongoose");
const serverExpress = require("./app");

const serverSocket = socketIO(serverExpress);

serverSocket.on("connection", (sock) => {
  sock.on("newProduct", async (agregarProducto) => {
    const newP = await productsService.createProduct(agregarProducto);
  });

  sock.on("deleted", async (idProduct) => {
    const id = idProduct.id;
    const deletProduct = await productsService.deleteProduct(id);
  });

  sock.on("ne", async (nuevoMensaje) => {
    const newchat = await chatService.addMessage(nuevoMensaje);
    const newMessage = await chatService.getChat();

    sock.broadcast.emit("new", newMessage);
    sock.emit("new", newMessage);
  });

  sock.on("addToCart", async (product) => {
    try {
      const email = product.email;
      const users = await usersService.verifyEmailUser(email);
  
      if (!users) {
        return console.error("Usuario no encontrado");
      }
  
      const idUser = new mongoose.Types.ObjectId(users._id);
      const productId = new mongoose.Types.ObjectId(product.idProduct);
  
      const productInCartVerify = await cartsService.productInCartVerify(idUser, productId);
  
      if (productInCartVerify) {
        let quantity = 1;
        await cartsService.updateQuantity(idUser, productId, quantity);
      } else {
        await cartsService.addProduct(idUser, productId);
      }
    } catch (error) {
      console.error("Error al procesar addToCart:", error);
    }
  });
  

  sock.on("sendTicket", async (ticket) => {
    const cartArray = [];
    const totalArray = [];
    const cartUser = await cartsService.cartsByUserId(ticket);
    const user = await usersService.userById(ticket);

    const cartProducts = cartUser.products;
    if (!cartUser) {
      console.log("Carrito no encontrado");
    } else {
      for (let i = 0; i < cartProducts.length; i++) {
        const product = await productsService.productById(cartProducts[i].product);
        if (product.stock < cartProducts[i].quantity) {
          let stock = false;
        } else {
          let id = cartProducts[i].product;
          let cantidad = cartProducts[i].quantity;
          const reduceStock = await productsService.stockReduce(id, cantidad);
          cartArray.push({ product: product.title, quantity: cartProducts[i].quantity });
          totalArray.push(parseFloat(cartProducts[i].quantity) * parseFloat(product.price));
          let carritoId = cartUser._id;
          let productId = cartProducts[i].product;
          const deleteProduct = await cartsService.deleteCartProduct(carritoId, productId);
        }
      }
    }
    const totalPrice = totalArray.reduce((acumulador, numero) => acumulador + numero, 0);
    let products = cartArray;
    let amount = Math.round(totalPrice);
    let userId = ticket;
    let email = user.email;
    let purchase_datetime = new Date();
    const createTicket = await ticketsService.createTicket(products, amount, userId, email, purchase_datetime);
    sock.emit("ticketCreated", createTicket);
  });
});

module.exports = serverSocket;
