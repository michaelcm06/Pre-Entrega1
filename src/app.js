const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const session = require("express-session")
const passport = require("passport")
const inicializaPassport = require("./config/passport.config")
const inicializePassportJWT = require("./config/jwt.config")
const fs = require("fs")
const products = require("./Routes/products.router")
const cart = require("./Routes/cart.router")
const handler = require("./Routes/views.router")
const chat = require("./Routes/chat.router")
const sessions_ = require("./Routes/session.router")

const handleBars = require("express-handlebars")
const path = require("path")
const s = require("socket.io").Server

const connectMongo = require("connect-mongo")
const mongoose = require("mongoose")

const productsService = require("./services/products.service")
const chatService = require("./services/chat.service")

const config = require("../src/config/config")
const cartsService = require("./services/carts.service")
const usersService = require("./services/users.service")
const ticketsModelo = require("./dao/models/tickets.modelo")
const ticketsService = require("./services/tickets.service")
const {
  selectDAO
} = require("./functions/selectDAO")

selectDAO()

PORT = parseInt(config.PORT)

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname + '/public')));
app.use(cookieParser());

app.engine("handlebars", handleBars.engine())
app.set("views", __dirname + "\\views");
app.set("view engine", "handlebars")

app.use(session({
  secret: config.SECRET,
  resave: true,
  saveUninitialized: true,
  store: connectMongo.create({
    mongoUrl: config.MONGO_URL,
    ttl: 3600
  })

}))


inicializaPassport()
inicializePassportJWT()
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/products", products)
app.use("/api/carts/", cart)
app.use("/", handler)
app.use("/chat", chat)
app.use("/api/sessions/", sessions_)

app.use((req, res, next) => {
  res.status(404).send("404 - Not Found");
});


const serverExpress = app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT)
})

const serverSocket = new s(serverExpress)
serverSocket.on("connection", sock => {

  sock.on("removeFromCart", async (product) => {
    const email = product.email;
    const users = await usersService.verifyEmailUser(email);
    const idUser = new mongoose.Types.ObjectId(users._id);
    const productId = new mongoose.Types.ObjectId(product.idProduct);

    const productInCartVerify = await cartsService.productInCartVerify(
      idUser,
      productId
    );

    if (productInCartVerify) {
      const removeResult = await cartsService.deleteCartProduct(idUser, productId);

      if (removeResult) {
        sock.emit("productRemoved");
      } else {
        sock.emit("productError", "No se pudo eliminar el producto del carrito");
      }
    } else {
      sock.emit("productError", "El producto no se encuentra en el carrito");
    }
  })

  sock.on("newProduct", async (agregarProducto) => {

    const newP = await productsService.createProduct(agregarProducto)
  })

  sock.on("deleted", async (idProduct) => {

    const id = idProduct.id
    const deletProduct = await productsService.deleteProduct(id)
  })

  sock.on("ne", async (nuevoMensaje) => {

    const newchat = await chatService.addMessage(nuevoMensaje)
    const newMessage = await chatService.getChat()

    sock.broadcast.emit("new", newMessage)
    sock.emit("new", newMessage)

  })
  sock.on("addToCart", async (product) => {

    const email = product.email
    const users = await usersService.verifyEmailUser(email)
    const idUser = new mongoose.Types.ObjectId(users._id)
    const productId = new mongoose.Types.ObjectId(product.idProduct)

    // Obtener información del producto y verificar el stock
    const productInfo = await productsService.productById(productId);
    if (!productInfo || productInfo.stock < 1) {
      // Producto no encontrado o sin stock
      sock.emit("productError", "Producto no disponible en stock");
      return;
    }

    const productInCartVerify = await cartsService.productInCartVerify(idUser, productId)

    if (productInCartVerify) {
      let quantity = 1
      const uploadProductQuantity = await cartsService.updateQuantity(idUser, productId, quantity)

    } else {
      const add = await cartsService.addProduct(idUser, productId)

    }
    sock.emit("productAdded");

  })
  sock.on("sendTicket", async (ticket) => {
    const cartArray = []
    const totalArray = []
    const cartUser = await cartsService.cartsByUserId(ticket)
    const user = await usersService.userById(ticket)

    //accedemos a products
    const cartProducts = cartUser.products
    if (!cartUser) {
      console.log("Carrito no encontrado")
    } else {

      for (let i = 0; i < cartProducts.length; i++) {

        const product = await productsService.productById(cartProducts[i].product)
        if (product.stock < cartProducts[i].quantity) {
          let stock = false

        } else {
          let id = cartProducts[i].product
          let cantidad = cartProducts[i].quantity
          const reduceStock = await productsService.stockReduce(id, cantidad)
          cartArray.push({
            product: product.title,
            quantity: cartProducts[i].quantity
          })
          totalArray.push(parseFloat(cartProducts[i].quantity) * parseFloat(product.price))
          let carritoId = cartUser._id
          let productId = cartProducts[i].product
          const deleteProduct = await cartsService.deleteCartProduct(carritoId, productId)

        }

      }

    }
    const totalPrice = totalArray.reduce((acumulador, numero) => acumulador + numero, 0)
    let products = cartArray
    let amount = Math.round(totalPrice)
    let userId = ticket
    let email = user.email
    let purchase_datetime = new Date()
    const createTicket = await ticketsService.createTicket(products, amount, userId, email, purchase_datetime)

    sock.emit("ticketProcessed", {
      message: "Ticket creado exitosamente",
      ticketInfo: {
          products: products,
          amount: amount,
          userId: userId,
          email: email,
          purchase_datetime: purchase_datetime
      }
    });
  })

})

mongoose.connect(config.MONGO_URL)
  .then(() => console.log("Conexión exitosa a la base de datos"))
  .catch(error => {
    console.error("Error de conexión a la base de datos:", error);
    process.exit(1); // Detener la aplicación si no se puede conectar a la base de datos
  });